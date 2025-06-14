import "@arco-design/web-react/dist/css/arco.css";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import DataViewer from "./lib";
import { Input } from "@arco-design/web-react";
import Row from "@arco-design/web-react/es/Grid/row";
import Col from "@arco-design/web-react/es/Grid/col";
import { IconGithub } from "@arco-design/web-react/icon";
import Text from "@arco-design/web-react/es/Typography/Text";

function App() {
  const [content, setContent] = useState("");
  return (
    <div
      style={{
        padding: "16px 16px 0 16px",
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Input.TextArea
            value={content}
            onChange={setContent}
            style={{ height: "91vh", resize: "none" }}
            placeholder="Input your data here"
          />
          <div
            style={{
              marginTop: "2vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <a href="https://github.com/conanyu/data-viewer" target="_blank">
              <IconGithub fontSize="3vh" style={{ color: "#000" }} />
            </a>
            <span style={{ marginLeft: "8px" }}>
              <Text>The entered data will only be parsed locally.</Text>
            </span>
          </div>
        </Col>
        <Col span={16}>
          <DataViewer title="Parse Result" data={content} />
        </Col>
      </Row>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
