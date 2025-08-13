import "@arco-design/web-react/dist/css/arco.css";
import _ from "lodash";
import JSON5 from "json5";
import YAML from "yaml";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type JSX,
  type ReactNode,
} from "react";
import { Message, Modal, Space, Tooltip } from "@arco-design/web-react";
import { IconCopy } from "@arco-design/web-react/icon";
import Text from "@arco-design/web-react/es/Typography/Text";

import styles from "./index.module.css";

const dataType = ["json", "json5", "yaml"] as const;

type DataType = (typeof dataType)[number];

const transMap: Record<DataType, (data: string) => unknown> = {
  json: JSON.parse,
  json5: JSON5.parse,
  yaml: YAML.parse,
};

function trans(props: { data: string; type?: DataType }):
  | {
      error: string;
    }
  | {
      type: DataType;
      data: unknown;
    } {
  const { data, type } = props;
  if (!type) {
    let error;
    for (const type of dataType) {
      try {
        const result = transMap[type](data);
        if (
          type === "yaml" &&
          (result === null ||
            ["bigint", "number", "string", "boolean"].includes(typeof result))
        ) {
          throw new Error("");
        }
        return { type, data: result };
      } catch (e) {
        if (type === "json") {
          error = e;
        }
      }
    }
    return { error: `${error}` };
  }
  try {
    return { type, data: transMap[type](data) };
  } catch (e) {
    return { error: `${e}` };
  }
}

interface HeaderProps {
  title?: string;
  data?: unknown;
}

function Header({ title, data }: HeaderProps) {
  const copyElement = (copyType: DataType) => (
    <div
      key={copyType}
      style={{
        lineHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        const content = {
          json: () => JSON.stringify(data, null, 2),
          json5: () => JSON5.stringify(data, null, 2),
          yaml: () => YAML.stringify(data, null, 2),
        }[copyType]();
        navigator.clipboard.writeText(content);
        Message.success(`Copy ${copyType.toUpperCase()} Success`);
      }}
    >
      <IconCopy />
      <Text style={{ fontSize: "6px" }}>{copyType.toUpperCase()}</Text>
    </div>
  );
  return (
    <div style={{ marginBottom: "0.25em" }}>
      {title || data ? (
        <Space>
          {title && (
            <Text key="title" style={{ fontSize: "1.25em" }}>
              {title}
            </Text>
          )}
          {data ? dataType.map((type) => copyElement(type)) : null}
        </Space>
      ) : null}
    </div>
  );
}

interface ViewerOption {
  forceDefaultCollapseLengthGte?: number; // 强制默认折叠长度，不填则为100。
}

type InteractionResult =
  | {
      event?:
        | ((e: MouseEvent) => void) // 点击回调
        | JSX.Element; // 弹窗
      title?: ReactNode; // Tooltip 文案
      isLowPriority?: boolean; // 是否低优先级
    }
  | undefined;

type Interaction = ({}: {
  data: unknown;
  depth: number;
  inModal: boolean;
  option?: ViewerOption;
  additionalInteraction?: Interaction;
}) => InteractionResult;

const defaultInteraction: Interaction = ({
  data,
  depth,
  option,
  additionalInteraction,
}) => {
  const viewer = (data: unknown) => {
    return (
      <>
        <Header title="Parse Result" data={data} />
        <pre className={styles["code-block"]}>
          <RootViewer
            data={data}
            option={option}
            inModal={true}
            additionalInteraction={additionalInteraction}
          />
        </pre>
      </>
    );
  };
  if (depth > 0 && isCollapsable(data)) {
    return {
      event: viewer(data),
      title: "JSON",
    };
  }
  if (typeof data === "string" && data) {
    if (data.startsWith("https://") || data.startsWith("http://")) {
      return {
        event: () => {
          window.open(data, "_blank");
        },
        title: "link",
      };
    }
    const tryParseResult = trans({ data });
    if ("type" in tryParseResult) {
      const { type, data } = tryParseResult;
      if (
        (type !== "yaml" && !["number", "bigint"].includes(typeof data)) ||
        (type === "yaml" &&
          !["string", "number", "bigint"].includes(typeof data))
      ) {
        return {
          event: viewer(tryParseResult.data),
          title: `Serialized ${type.toUpperCase()}`,
        };
      }
    }
    if (data.length > (option?.forceDefaultCollapseLengthGte ?? 100)) {
      return {
        event: (
          <div>
            <Space style={{ marginBottom: "0.25em" }}>
              <Text style={{ fontSize: "1.25em" }}>Long Text</Text>
              <IconCopy
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigator.clipboard.writeText(data);
                  Message.success("Copy Success");
                }}
              />
            </Space>
            <pre
              className={styles["code-block"]}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {data}
            </pre>
          </div>
        ),
        title: "Long Text",
      };
    }
  }
  return undefined;
};

interface InnerViewerProps {
  data: unknown;
  depth: number;
  collapsed: boolean;
  setCollapsed: Dispatch<boolean>;
  inModal: boolean;
  additionalInteraction?: Interaction;
  option?: ViewerOption;
}

function dataLength(data: unknown): number {
  if (typeof data === "object" && data !== null) {
    return Object.keys(data).length;
  }
  if (data instanceof Array) {
    return data.length;
  }
  return 0;
}

function isCollapsable(arg: unknown) {
  return arg instanceof Object && Object.keys(arg).length > 0;
}

function InnerViewer(props: InnerViewerProps) {
  const {
    data,
    depth,
    collapsed,
    setCollapsed,
    additionalInteraction,
    option,
    inModal,
  } = props;
  const length = dataLength(data);
  const [sonCollapsed, setSonCollapsed] = useState<boolean[]>(
    Array(length).fill(false)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const interaction = useMemo(() => {
    const interactionParams = {
      data,
      depth,
      option,
      inModal,
      additionalInteraction,
    };
    const result = additionalInteraction?.(interactionParams);
    if (result?.isLowPriority) {
      return defaultInteraction(interactionParams) || result;
    }
    return result || defaultInteraction(interactionParams);
  }, [data, additionalInteraction]);
  useEffect(() => {
    setSonCollapsed(Array(length).fill(false));
  }, [length]);
  const setCollapsedFunc = (index: number) => {
    return (value: boolean) => {
      if (sonCollapsed[index] !== value) {
        const newSonCollapsed = _.cloneDeep(sonCollapsed);
        newSonCollapsed[index] = value;
        setSonCollapsed(newSonCollapsed);
      }
    };
  };
  const innerElement = (() => {
    if (typeof data === "string") {
      return (
        <span className={styles["json-string"]}>{JSON.stringify(data)}</span>
      );
    } else if (
      typeof data === "number" ||
      typeof data === "bigint" ||
      typeof data === "boolean" ||
      data === null
    ) {
      const text = data === null ? "null" : data.toString();
      return <span className={styles["json-literal"]}>{text}</span>;
    } else if (data instanceof Array) {
      if (data.length > 0) {
        return (
          <>
            {"["}
            {collapsed ? (
              <a
                className={styles["json-placeholder"]}
                onClick={() => setCollapsed(false)}
              >{`${data.length} item${data.length > 1 ? "s" : ""}`}</a>
            ) : (
              <ol className={styles["json-array"]}>
                {data.map((item, index) => {
                  return (
                    <li key={index}>
                      {isCollapsable(item) && (
                        <a
                          className={`${styles["json-toggle"]} ${
                            sonCollapsed?.[index] ? styles["collapsed"] : ""
                          }`}
                          onClick={() => {
                            setCollapsedFunc(index)(!sonCollapsed?.[index]);
                          }}
                        />
                      )}
                      <InnerViewer
                        data={item}
                        depth={depth + 1}
                        collapsed={sonCollapsed?.[index]}
                        setCollapsed={setCollapsedFunc(index)}
                        additionalInteraction={additionalInteraction}
                        option={option}
                        inModal={inModal}
                      />
                      {index < data.length - 1 && <>,</>}
                    </li>
                  );
                })}
              </ol>
            )}
            {"]"}
          </>
        );
      } else {
        return <>{"[]"}</>;
      }
    } else if (typeof data === "object") {
      let keyCount = Object.keys(data).length;
      if (keyCount > 0) {
        return (
          <>
            {"{"}
            {collapsed ? (
              <a
                className={styles["json-placeholder"]}
                onClick={() => setCollapsed(false)}
              >{`${keyCount} item${keyCount > 1 ? "s" : ""}`}</a>
            ) : (
              <ul className={styles["json-dict"]}>
                {Object.entries(data).map(([key, son], index) => {
                  const isCollapsableSon = isCollapsable(son);
                  const keyRepr = (
                    <span
                      className={styles["json-string"]}
                      style={{
                        cursor: isCollapsableSon ? "pointer" : undefined,
                      }}
                      onClick={() => {
                        if (isCollapsableSon) {
                          setCollapsedFunc(index)(!sonCollapsed?.[index]);
                        }
                      }}
                    >
                      {JSON.stringify(key)}
                    </span>
                  );
                  return (
                    <li key={key}>
                      {isCollapsable(son) && (
                        <a
                          className={`${styles["json-toggle"]} ${
                            sonCollapsed?.[index] ? styles["collapsed"] : ""
                          }`}
                          onClick={() => {
                            setCollapsedFunc(index)(!sonCollapsed?.[index]);
                          }}
                        />
                      )}
                      {keyRepr}
                      {": "}
                      <InnerViewer
                        data={son}
                        depth={depth + 1}
                        collapsed={sonCollapsed?.[index]}
                        setCollapsed={setCollapsedFunc(index)}
                        additionalInteraction={additionalInteraction}
                        option={option}
                        inModal={inModal}
                      />
                      {index !== keyCount - 1 && <>,</>}
                    </li>
                  );
                })}
              </ul>
            )}
            {"}"}
          </>
        );
      } else {
        return <>{"{}"}</>;
      }
    }
  })();
  return (
    <>
      {interaction && (
        <Tooltip
          className="conanyu-data-viewer-interaction-tooltip"
          content={interaction.title}
          getPopupContainer={(e) => e.parentNode!.parentNode as Element}
        >
          <span>
            <a
              href={
                typeof interaction.title === "string"
                  ? `operating: ${interaction.title}`
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div
                className={styles["circle-button"]}
                onClick={(e) => {
                  if (typeof interaction.event === "function") {
                    interaction.event(e.nativeEvent);
                  } else {
                    setModalVisible(true);
                  }
                }}
              />
            </a>
          </span>
        </Tooltip>
      )}
      {innerElement}
      {interaction?.event && typeof interaction.event !== "function" && (
        <Modal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
          }}
          style={{
            width: "100%",
            maxWidth: "85vw",
          }}
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { display: "none" } }}
          focusLock={false}
          autoFocus={false}
          closable={false}
          footer={null}
        >
          <div className={styles["code-container"]}>{interaction.event}</div>
        </Modal>
      )}
    </>
  );
}

interface ViewerProps {
  data: unknown;
  option?: ViewerOption;
  additionalInteraction?: Interaction;
}

interface RootViewerProps extends ViewerProps {
  inModal: boolean;
}

function RootViewer(props: RootViewerProps) {
  const { data, option, additionalInteraction, inModal } = props;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      {isCollapsable(data) && (
        <a
          className={`${styles["json-toggle"]} ${
            collapsed ? styles["collapsed"] : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        />
      )}
      <InnerViewer
        data={data}
        depth={0}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        option={option}
        additionalInteraction={additionalInteraction}
        inModal={inModal}
      />
    </>
  );
}

function Viewer(props: ViewerProps) {
  return <RootViewer {...props} inModal={false} />;
}

interface DataViewerProps {
  data: string;
  type?: DataType;
  title?: string;
  additionalInteraction?: Interaction;
  style?: CSSProperties;
  withoutHeader?: boolean;
}

function DataViewer({
  data,
  type,
  title,
  additionalInteraction,
  style,
  withoutHeader,
}: DataViewerProps) {
  const result = trans({ data, type });
  return (
    <div>
      {!withoutHeader && (
        <Header
          title={title}
          data={"data" in result && result.data ? result.data : undefined}
        />
      )}
      <pre className={styles["code-block"]} style={style}>
        {!data ? (
          <></>
        ) : "error" in result ? (
          <p>{result.error}</p>
        ) : (
          <Viewer
            data={result.data}
            additionalInteraction={additionalInteraction}
          />
        )}
      </pre>
    </div>
  );
}

export default DataViewer;

export {
  dataType,
  type DataType,
  type DataViewerProps,
  type ViewerOption,
  type InteractionResult,
  type Interaction,
};
