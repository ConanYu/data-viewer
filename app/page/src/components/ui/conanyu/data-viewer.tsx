// https://github.com/conanyu/data-viewer/blob/main/app/page/src/components/ui/conanyu/data-viewer.tsx

import JSONBigInt from 'json-bigint';
import JSON5 from 'json5-bigint';
import YAML from 'yaml';
import { ButtonGroup } from '@/components/ui/button-group.tsx';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';
import { buttonVariants } from '@/components/ui/button.tsx';
import {
  CircleMinus,
  CirclePlus,
  CopyIcon,
  Ellipsis,
  Eye,
  EyeOff,
  LoaderCircle,
  Maximize,
  Palette,
  SquarePen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner.tsx';
import { createHighlighter, type HighlighterGeneric, type ThemeRegistration, type TokensResult } from 'shiki';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';

// theme
import Andromeeda from 'tm-themes/themes/andromeeda.json';
import AuroraX from 'tm-themes/themes/aurora-x.json';
import AyuDark from 'tm-themes/themes/ayu-dark.json';
import CatppuccinFrappe from 'tm-themes/themes/catppuccin-frappe.json';
import CatppuccinLatte from 'tm-themes/themes/catppuccin-latte.json';
import CatppuccinMacchiato from 'tm-themes/themes/catppuccin-macchiato.json';
import CatppuccinMocha from 'tm-themes/themes/catppuccin-mocha.json';
import DarkPlus from 'tm-themes/themes/dark-plus.json';
import Dracula from 'tm-themes/themes/dracula.json';
import DraculaSoft from 'tm-themes/themes/dracula-soft.json';
import EverforestDark from 'tm-themes/themes/everforest-dark.json';
import EverforestLight from 'tm-themes/themes/everforest-light.json';
import GitHubDark from 'tm-themes/themes/github-dark.json';
import GitHubDarkDefault from 'tm-themes/themes/github-dark-default.json';
import GitHubDarkDimmed from 'tm-themes/themes/github-dark-dimmed.json';
import GitHubDarkHighContrast from 'tm-themes/themes/github-dark-high-contrast.json';
import GitHubLight from 'tm-themes/themes/github-light.json';
import GitHubLightDefault from 'tm-themes/themes/github-light-default.json';
import GitHubLightHighContrast from 'tm-themes/themes/github-light-high-contrast.json';
import GruvboxDarkHard from 'tm-themes/themes/gruvbox-dark-hard.json';
import GruvboxDarkMedium from 'tm-themes/themes/gruvbox-dark-medium.json';
import GruvboxDarkSoft from 'tm-themes/themes/gruvbox-dark-soft.json';
import GruvboxLightHard from 'tm-themes/themes/gruvbox-light-hard.json';
import GruvboxLightMedium from 'tm-themes/themes/gruvbox-light-medium.json';
import GruvboxLightSoft from 'tm-themes/themes/gruvbox-light-soft.json';
import Houston from 'tm-themes/themes/houston.json';
import KanagawaDragon from 'tm-themes/themes/kanagawa-dragon.json';
import KanagawaLotus from 'tm-themes/themes/kanagawa-lotus.json';
import KanagawaWave from 'tm-themes/themes/kanagawa-wave.json';
import LaserWave from 'tm-themes/themes/laserwave.json';
import LightPlus from 'tm-themes/themes/light-plus.json';
import MaterialTheme from 'tm-themes/themes/material-theme.json';
import MaterialThemeDarker from 'tm-themes/themes/material-theme-darker.json';
import MaterialThemeLighter from 'tm-themes/themes/material-theme-lighter.json';
import MaterialThemeOcean from 'tm-themes/themes/material-theme-ocean.json';
import MaterialThemePalenight from 'tm-themes/themes/material-theme-palenight.json';
import MinDark from 'tm-themes/themes/min-dark.json';
import MinLight from 'tm-themes/themes/min-light.json';
import Monokai from 'tm-themes/themes/monokai.json';
import NightOwl from 'tm-themes/themes/night-owl.json';
import Nord from 'tm-themes/themes/nord.json';
import OneDarkPro from 'tm-themes/themes/one-dark-pro.json';
import OneLight from 'tm-themes/themes/one-light.json';
import Plastic from 'tm-themes/themes/plastic.json';
import Poimandres from 'tm-themes/themes/poimandres.json';
import Red from 'tm-themes/themes/red.json';
import RosePine from 'tm-themes/themes/rose-pine.json';
import RosePineDawn from 'tm-themes/themes/rose-pine-dawn.json';
import RosePineMoon from 'tm-themes/themes/rose-pine-moon.json';
import SlackDark from 'tm-themes/themes/slack-dark.json';
import SlackOchin from 'tm-themes/themes/slack-ochin.json';
import SnazzyLight from 'tm-themes/themes/snazzy-light.json';
import SolarizedDark from 'tm-themes/themes/solarized-dark.json';
import SolarizedLight from 'tm-themes/themes/solarized-light.json';
import Synthwave84 from 'tm-themes/themes/synthwave-84.json';
import TokyoNight from 'tm-themes/themes/tokyo-night.json';
import Vesper from 'tm-themes/themes/vesper.json';
import VitesseBlack from 'tm-themes/themes/vitesse-black.json';
import VitesseDark from 'tm-themes/themes/vitesse-dark.json';
import VitesseLight from 'tm-themes/themes/vitesse-light.json';

const themes = {
  Andromeeda: Andromeeda,
  'Aurora X': AuroraX,
  'Ayu Dark': AyuDark,
  'Catppuccin Frappé': CatppuccinFrappe,
  'Catppuccin Latte': CatppuccinLatte,
  'Catppuccin Macchiato': CatppuccinMacchiato,
  'Catppuccin Mocha': CatppuccinMocha,
  'Dark Plus': DarkPlus,
  'Dracula Theme': Dracula,
  'Dracula Theme Soft': DraculaSoft,
  'Everforest Dark': EverforestDark,
  'Everforest Light': EverforestLight,
  'GitHub Dark': GitHubDark,
  'GitHub Dark Default': GitHubDarkDefault,
  'GitHub Dark Dimmed': GitHubDarkDimmed,
  'GitHub Dark High Contrast': GitHubDarkHighContrast,
  'GitHub Light': GitHubLight,
  'GitHub Light Default': GitHubLightDefault,
  'GitHub Light High Contrast': GitHubLightHighContrast,
  'Gruvbox Dark Hard': GruvboxDarkHard,
  'Gruvbox Dark Medium': GruvboxDarkMedium,
  'Gruvbox Dark Soft': GruvboxDarkSoft,
  'Gruvbox Light Hard': GruvboxLightHard,
  'Gruvbox Light Medium': GruvboxLightMedium,
  'Gruvbox Light Soft': GruvboxLightSoft,
  Houston: Houston,
  'Kanagawa Dragon': KanagawaDragon,
  'Kanagawa Lotus': KanagawaLotus,
  'Kanagawa Wave': KanagawaWave,
  LaserWave: LaserWave,
  'Light Plus': LightPlus,
  'Material Theme': MaterialTheme,
  'Material Theme Darker': MaterialThemeDarker,
  'Material Theme Lighter': MaterialThemeLighter,
  'Material Theme Ocean': MaterialThemeOcean,
  'Material Theme Palenight': MaterialThemePalenight,
  'Min Dark': MinDark,
  'Min Light': MinLight,
  Monokai: Monokai,
  'Night Owl': NightOwl,
  Nord: Nord,
  'One Dark Pro': OneDarkPro,
  'One Light': OneLight,
  Plastic: Plastic,
  Poimandres: Poimandres,
  Red: Red,
  'Rosé Pine': RosePine,
  'Rosé Pine Dawn': RosePineDawn,
  'Rosé Pine Moon': RosePineMoon,
  'Slack Dark': SlackDark,
  'Slack Ochin': SlackOchin,
  'Snazzy Light': SnazzyLight,
  'Solarized Dark': SolarizedDark,
  'Solarized Light': SolarizedLight,
  "Synthwave '84": Synthwave84,
  'Tokyo Night': TokyoNight,
  Vesper: Vesper,
  'Vitesse Black': VitesseBlack,
  'Vitesse Dark': VitesseDark,
  'Vitesse Light': VitesseLight,
};

const JSON = JSONBigInt({ useNativeBigInt: true });

// 转化逻辑
const dataType = ['json', 'json5', 'yaml'] as const;
type DataType = (typeof dataType)[number];

type TransFunc = (text: string) => unknown;
const transMap: Record<DataType, TransFunc> = {
  json: JSON.parse,
  json5: JSON5.parse,
  yaml: (text: string) => YAML.parse(text, { intAsBigInt: true }),
};

function trans(props: { data: string; type?: DataType }):
  | {
      type: 'error';
      data: undefined;
      error: string;
    }
  | {
      type: DataType;
      data: unknown;
      error: undefined;
    } {
  const { data, type } = props;
  if (!type) {
    let error;
    for (const type of dataType) {
      let result = undefined;
      try {
        result = transMap[type](data);
      } catch (e) {
        if (type === 'json5') {
          error = e;
        }
      }
      if (result === undefined) {
        continue;
      }
      if (type === 'yaml' && (result === null || ['bigint', 'number', 'string', 'boolean'].includes(typeof result))) {
        continue;
      }
      return { type, data: result, error: undefined };
    }
    return { type: 'error', error: `${error}`, data: undefined };
  }
  try {
    return { type, data: transMap[type](data), error: undefined };
  } catch (e) {
    return { type: 'error', error: `${e}`, data: undefined };
  }
}

// 交互逻辑
type InteractionResult =
  | {
      event?:
        | ((e: MouseEvent) => void) // 点击回调
        | ReactNode; // 弹窗
      title?: ReactNode; // Tooltip 文案
      highPriority?: boolean; // 是否高优先级
    }
  | undefined;

type Interaction = (r: { data: unknown; depth: number; config?: DataViewerConfig }) => InteractionResult;

const TooltipButton = ({
  tooltip,
  icon,
  onClick,
  link,
}: {
  tooltip: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
  link?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({
          variant: 'outline',
          size: 'icon',
          className: 'cursor-pointer bg-white text-gray-600',
        })}
        onClick={onClick}
      >
        {link ? (
          <a href={link} onClick={e => e.preventDefault()}>
            {icon}
          </a>
        ) : (
          icon
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

function LongTextDialogContent({ data, config }: { data: string; config?: DataViewerConfig }) {
  const [showToolbar, setShowToolbar] = useState(true);

  return (
    <div className="relative overflow-auto scrollbar-thin border-2 rounded-md">
      <pre
        className={cn(
          showToolbar ? 'overflow-y-scroll' : 'overflow-auto',
          'scrollbar-thin max-h-[80vh] p-4 text-sm font-mono whitespace-pre-wrap',
        )}
        style={{
          backgroundColor: config?.defaultTheme?.bg || config?.defaultTheme?.colors?.['editor.background'],
          color: config?.defaultTheme?.fg || config?.defaultTheme?.colors?.['editor.foreground'],
        }}
      >
        {data}
      </pre>
      <div className={cn('absolute right-4 top-2', !showToolbar && 'hidden')}>
        <ButtonGroup>
          <div className={buttonVariants({ variant: 'outline' })}>长文本</div>
          <TooltipButton
            tooltip="复制"
            icon={<CopyIcon />}
            onClick={async () => {
              await navigator.clipboard.writeText(data);
              toast.success('复制成功');
            }}
          />
          <TooltipButton tooltip="隐藏工具栏" icon={<EyeOff />} onClick={() => setShowToolbar(false)} />
        </ButtonGroup>
      </div>
    </div>
  );
}

const defaultInteraction: Interaction = ({ data, depth, config }) => {
  const length = collapseLength(data);
  const viewer = (data: unknown, title?: string) => (
    <DataViewer
      data={JSON.stringify(data)}
      title={title}
      config={{ ...config, type: 'json', withToaster: false }}
      className="border-2 rounded-md"
      preClassName="max-h-[80vh]"
    />
  );
  if (depth > 0 && length > 0) {
    return {
      event: viewer(data, 'JSON'),
      title: 'JSON',
    };
  }
  if (typeof data === 'string' && data) {
    if (data.startsWith('https://') || data.startsWith('http://')) {
      return {
        event: () => {
          window.open(data, '_blank');
        },
        title: '链接',
      };
    }
    const tryParseResult = trans({ data });
    if (typeof tryParseResult.error !== 'string') {
      const { type, data } = tryParseResult;
      if (
        (type !== 'yaml' && !['number', 'bigint'].includes(typeof data)) ||
        (type === 'yaml' && !['string', 'number', 'bigint'].includes(typeof data))
      ) {
        const title = type === 'json' ? 'JSON' : type === 'json5' ? 'JSON5' : 'YAML';
        return {
          event: viewer(data, title),
          title,
        };
      }
    }
    if (data.length > (config?.showInteractionWithStringLengthGte ?? 100)) {
      return {
        event: <LongTextDialogContent data={data} config={config} />,
        title: '长文本',
      };
    }
  }
  return undefined;
};

// 内部组件
interface InnerViewerProps {
  themeInfo: ThemeRegistration;
  node: ViewerNode;
  mode: 'normal' | 'edit';
  onValueChange: (v: unknown) => void;
  config?: DataViewerConfig;
}

function collapseLength(v: unknown): number {
  return typeof v === 'object' && v !== null ? Object.keys(v).length : 0;
}

function InteractionCircle({
  onClick,
  content,
  className,
  themeInfo,
}: {
  onClick: (e: MouseEvent) => void;
  content: string;
  className?: string;
  themeInfo: ThemeRegistration;
}) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className={cn('font-sans mr-0.5 select-none cursor-pointer opacity-70 hover:opacity-100', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={e => onClick(e.nativeEvent)}
      style={{
        color: hover
          ? themeInfo.colors?.['button.hoverBackground'] || themeInfo.colors?.['button.background']
          : themeInfo.colors?.['button.background'],
      }}
    >
      {content}
    </span>
  );
}

function InteractionTriangle({
  themeInfo,
  onClick,
  collapsed,
}: {
  themeInfo: ThemeRegistration;
  onClick: (e: MouseEvent) => void;
  collapsed: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className={cn(
        'cursor-pointer absolute text-center left-4 select-none top-[-0.2rem] text-base opacity-70',
        collapsed && 'rotate-270',
      )}
      onClick={e => onClick(e.nativeEvent)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover
          ? themeInfo.colors?.['button.hoverBackground'] || themeInfo.colors?.['button.background']
          : themeInfo.colors?.['button.background'],
      }}
    >
      {'\u25BC'}
    </span>
  );
}

function AddValueDialogContent({
  isArray,
  onSubmitValue,
  config,
}: {
  isArray: boolean;
  onSubmitValue: (k: string, v: unknown) => void;
  config?: DataViewerConfig;
}) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('"输入数据"');
  const data = useMemo(() => trans({ data: value, type: config?.type }), [value, config?.type]);

  return (
    <DialogContent
      className="w-full !max-w-[60vw]"
      onOpenAutoFocus={e => e.preventDefault()}
      showCloseButton={false}
      aria-describedby={undefined}
    >
      <VisuallyHidden asChild>
        <DialogTitle />
      </VisuallyHidden>
      <div className="flex gap-4">
        <div className="h-[calc(60vh-2rem)]">
          {isArray ? (
            <Textarea
              className="w-[calc(30vw-1.75rem)] h-full resize-none scrollbar-thin bg-gray-100"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="输入数据"
            />
          ) : (
            <>
              <Input
                className="w-[calc(30vw-1.75rem)] mb-4 bg-gray-100"
                placeholder="输入KEY"
                value={key}
                onChange={e => setKey(e.target.value)}
              />
              <Textarea
                className="w-[calc(30vw-1.75rem)] h-[calc(60vh-5.25rem)] resize-none scrollbar-thin bg-gray-100"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="输入数据"
              />
            </>
          )}
        </div>
        <div className="border-2 rounded-md w-[calc(30vw-2.25rem)] h-[calc(60vh-2rem)] relative">
          <DataViewer
            className="rounded-md h-full"
            preClassName="h-full"
            data={value}
            onDataChange={data => setValue(JSON.stringify(data, null, 2))}
            config={{ ...config, withToaster: false }}
          />
          <Button
            className="absolute bottom-3 right-3 cursor-pointer"
            size="sm"
            disabled={(!isArray && !key) || !!data.error}
            onClick={() => onSubmitValue(key, data.data)}
          >
            确认
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function InnerViewer(props: InnerViewerProps) {
  const { node, config, themeInfo, mode, onValueChange } = props;
  const { forceDefaultCollapseLengthGte } = config || {};
  const [collapsed, setCollapsed] = useState(node.length > (forceDefaultCollapseLengthGte || 100));
  const [keyHover, setKeyHover] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setCollapsed(node.length > (forceDefaultCollapseLengthGte || 100));
  }, [node.length, config?.forceDefaultCollapseLengthGte]);

  const interaction = useMemo(() => {
    const props = { data: node.data, depth: node.depth, config };
    const interaction = config?.additionalInteraction?.(props);
    if (interaction?.highPriority) {
      return interaction;
    }
    return defaultInteraction(props);
  }, [node, config?.additionalInteraction]);

  let interactionTrigger: ReactNode = null;

  if (mode === 'normal') {
    if (interaction) {
      interactionTrigger = (
        <InteractionCircle
          content={'\u25CF'}
          key="interaction-trigger"
          onClick={e => {
            if (typeof interaction.event === 'function') {
              interaction.event(e);
            }
          }}
          themeInfo={themeInfo}
        />
      );
      if (interaction.title) {
        interactionTrigger = (
          <Tooltip key="interaction-tooltip">
            <TooltipTrigger>{interactionTrigger}</TooltipTrigger>
            <TooltipContent>{interaction.title}</TooltipContent>
          </Tooltip>
        );
      }
      if (typeof interaction.event !== 'function') {
        interactionTrigger = (
          <Dialog key="interaction-dialog">
            <DialogTrigger>{interactionTrigger}</DialogTrigger>
            <DialogContent
              showCloseButton={false}
              autoFocus={false}
              onOpenAutoFocus={e => e.preventDefault()}
              className="w-full !max-w-[80vw]"
              aria-describedby={undefined}
            >
              <VisuallyHidden asChild>
                <DialogTitle />
              </VisuallyHidden>
              {interaction.event}
            </DialogContent>
          </Dialog>
        );
      }
    }
  } else if (mode === 'edit') {
    if (node.depth !== 0) {
      interactionTrigger = (
        <Tooltip key="interaction-minus">
          <TooltipTrigger>
            <CircleMinus
              className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mr-0.5"
              onClick={() => onValueChange(undefined)}
              style={{ color: themeInfo.colors?.['button.background'] }}
            />
          </TooltipTrigger>
          <TooltipContent>删除</TooltipContent>
        </Tooltip>
      );
    }
    if (node.data !== null && typeof node.data === 'object') {
      const isArray = Array.isArray(node.data);
      interactionTrigger = (
        <span key="interaction-plus">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CirclePlus
                    className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mr-1"
                    style={{ color: themeInfo.colors?.['button.background'] }}
                  />
                </TooltipTrigger>
                <TooltipContent>添加</TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <AddValueDialogContent
              isArray={isArray}
              config={config}
              onSubmitValue={(k, v) => {
                if (isArray) {
                  (node.data as unknown[]).push(v);
                } else {
                  (node.data as Record<string, unknown>)[k] = v;
                }
                onValueChange(node.data);
                setDialogOpen(false);
              }}
            />
          </Dialog>
          {interactionTrigger}
        </span>
      );
    }
  }

  return (
    <div className="relative">
      {node.length > 0 && (
        <InteractionTriangle
          onClick={() => {
            setCollapsed(collapsed => !collapsed);
          }}
          collapsed={collapsed}
          themeInfo={themeInfo}
        />
      )}
      <div className="pl-8">
        {node.before.map((item, index) => {
          if (item.type === ViewerContentTypeInteraction) {
            return interactionTrigger;
          }
          const canCollapse = item.type === ViewerContentTypeKey && node.length > 0;
          return (
            <span
              key={index}
              style={{ color: item.color }}
              className={cn(canCollapse && keyHover && 'cursor-pointer')}
              onMouseEnter={() => canCollapse && setKeyHover(true)}
              onMouseLeave={() => canCollapse && setKeyHover(false)}
              onClick={() => {
                if (canCollapse) {
                  setCollapsed(collapsed => !collapsed);
                }
              }}
            >
              {item.content}
            </span>
          );
        })}
        {collapsed ? (
          <span
            style={{ color: themeInfo.fg || themeInfo.colors?.['editor.foreground'] }}
            className="px-3 hover:underline cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            {node.length} item{node.length > 1 ? 's' : ''}
          </span>
        ) : node.children.length > 0 ? (
          <div className="border-l border-dotted" style={{ borderColor: themeInfo.colors?.['editor.foreground'] }}>
            {node.children.map((item, index) => (
              <InnerViewer
                key={index}
                {...props}
                mode={mode}
                node={item}
                onValueChange={value => {
                  let data = node.data;
                  if (data !== null) {
                    if (value === undefined) {
                      if (Array.isArray(data)) {
                        data = data.filter((_, i) => i !== index);
                      } else if (typeof data === 'object') {
                        const newData: Record<string, unknown> = {};
                        Object.entries(data).forEach(([key, dataValue], i) => {
                          if (i !== index) {
                            newData[key] = dataValue;
                          }
                        });
                        data = newData;
                      }
                    } else {
                      if (Array.isArray(data)) {
                        data[index] = value;
                      } else if (typeof data === 'object') {
                        const newData: Record<string, unknown> = {};
                        Object.entries(data).forEach(([key, dataValue], i) => {
                          newData[key] = i !== index ? dataValue : value;
                        });
                        data = newData;
                      }
                    }
                    onValueChange(data);
                  }
                }}
              />
            ))}
          </div>
        ) : null}
        {node.after.map((item, index) => (
          <span key={index} style={{ color: item.color }}>
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
}

// 计算层级和颜色
const ViewerContentTypeNormal = 0 as const;
const ViewerContentTypeKey = 1 as const;
const ViewerContentTypeInteraction = 2 as const;
type ViewerContentType =
  | typeof ViewerContentTypeNormal
  | typeof ViewerContentTypeKey
  | typeof ViewerContentTypeInteraction;

interface ViewerContent {
  content: string;
  color?: string;
  type: ViewerContentType;
}

interface ViewerNode {
  data: unknown;
  length: number;
  depth: number;
  before: ViewerContent[];
  children: ViewerNode[];
  after: ViewerContent[];
}

function calcDfs(props: {
  data: unknown;
  color: (string | undefined)[];
  from: number;
  depth: number;
  key?: string;
  comma?: boolean;
}): [ViewerNode, number] {
  const { data, color, from, depth, key, comma } = props;
  const length = collapseLength(data);
  const node: ViewerNode = {
    length: length,
    before: [],
    children: [],
    depth,
    after: [],
    data: data,
  };
  let index = from;
  const toViewerContent = (s: string, type?: ViewerContentType) => {
    const current: ViewerContent[] = [];
    for (const c of s) {
      const lastColor = current?.[current.length - 1]?.color;
      const currentColor = color?.[index];
      if (lastColor === currentColor) {
        current[current.length - 1].content += c;
      } else {
        current.push({ content: c, color: currentColor, type: type || ViewerContentTypeNormal });
      }
      index++;
    }
    return current;
  };
  if (key !== undefined) {
    const current = toViewerContent(JSON.stringify(key), ViewerContentTypeKey);
    node.before.push(...current, { content: ': ', color: color?.[index], type: ViewerContentTypeNormal });
    index++;
  }
  node.before.push({ content: '', type: ViewerContentTypeInteraction });
  if (typeof data === 'string') {
    node.before.push(...toViewerContent(JSON.stringify(data)));
  } else if (typeof data === 'number' || typeof data === 'bigint' || typeof data === 'boolean' || data === null) {
    const text = data === null ? 'null' : data.toString();
    node.before.push(...toViewerContent(text));
  } else if (data instanceof Array) {
    if (length > 0) {
      node.before.push(...toViewerContent('['));
      for (let i = 0; i < length; i++) {
        const [child, newIndex] = calcDfs({
          data: data[i],
          color,
          from: index,
          depth: depth + 1,
          comma: i < length - 1,
        });
        node.children.push(child);
        index = newIndex;
      }
      node.after.push(...toViewerContent(']'));
    } else {
      node.before.push(...toViewerContent('[]'));
    }
  } else if (typeof data === 'object') {
    if (length > 0) {
      node.before.push(...toViewerContent('{'));
      Object.entries(data).forEach(([key, son], objectIndex) => {
        const [child, newIndex] = calcDfs({
          data: son,
          color,
          from: index,
          depth: depth + 1,
          key,
          comma: objectIndex < length - 1,
        });
        node.children.push(child);
        index = newIndex;
      });
      node.after.push(...toViewerContent('}'));
    } else {
      node.before.push(...toViewerContent('{}'));
    }
  }

  if (comma) {
    node.after.push({ content: ',', color: color?.[index], type: ViewerContentTypeNormal });
    index++;
  }
  return [node, index];
}

function calc(data: unknown, t: TokensResult): ViewerNode {
  const color: (string | undefined)[] = [];
  for (const t1 of t.tokens) {
    for (const t2 of t1) {
      for (let i = 0; i < t2.content.length; i++) {
        color.push(t2.color);
      }
    }
  }
  return calcDfs({ data, color, from: 0, depth: 0 })[0];
}

// 入口组件
interface DataViewerConfig {
  type?: DataType; // 强制制定数据类型 不填则根据数据自动判断
  defaultTheme?: ThemeRegistration; // 默认自定义主题 默认为vitesse-light
  withoutButtonGroup?: boolean; // 是否不展示操作按钮组
  withToaster?: boolean; // 是否需要toaster
  withoutMaximize?: boolean; // 是否不展示最大化按钮
  withThemeChange?: boolean; // 是否开启主题切换
  forceDefaultCollapseLengthGte?: number; // 强制默认折叠长度 不填则为100
  showInteractionWithStringLengthGte?: number; // 展示交互的字符串长度阈值 不填则为100
  additionalInteraction?: Interaction; // 自定义交互逻辑
  uneditable?: boolean; // 是否可编辑
}

interface DataViewerProps {
  data: string;
  className?: string;
  preClassName?: string;
  title?: string;
  onDataChange?: (data: unknown) => void; // 数据编辑回调
  onBundledThemeChange?: (theme: ThemeRegistration) => void; // 默认主题切换回调
  onCloseButtonGroup?: (e: MouseEvent) => void; // 关闭工具栏回调
  config?: DataViewerConfig;
}

const globalHighlighter: Map<ThemeRegistration, HighlighterGeneric<string, string>> = new Map();

function DataViewer(props: DataViewerProps) {
  // 处理主题
  const { type, defaultTheme, withoutButtonGroup, withoutMaximize, withToaster, withThemeChange, uneditable } =
    props.config || {};
  const [themeInfo, setThemeInfo] = useState<ThemeRegistration>(VitesseLight as ThemeRegistration);
  useEffect(() => {
    setThemeInfo(defaultTheme ? defaultTheme : (VitesseLight as ThemeRegistration));
  }, [defaultTheme]);
  const [withButtonGroup, setWithButtonGroup] = useState(!withoutButtonGroup);
  const [source, setSource] = useState(props.data);
  useEffect(() => {
    setSource(props.data);
  }, [props.data]);
  const [mode, setMode] = useState<'normal' | 'edit'>('normal');

  // 处理转化逻辑
  const data = useMemo(() => trans({ data: source, type: type }), [source, type]);

  // 处理样式
  const [highlighter, setHighlighter] = useState<[HighlighterGeneric<string, string>, ThemeRegistration] | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const cachedHighlighter = globalHighlighter.get(themeInfo);
      if (cachedHighlighter) {
        setHighlighter([cachedHighlighter, themeInfo]);
      } else {
        const highlighter = (await createHighlighter({
          langs: ['json'],
          themes: [themeInfo],
        })) as HighlighterGeneric<string, string>;
        setHighlighter([highlighter, themeInfo]);
        globalHighlighter.set(themeInfo, highlighter);
      }
    })();
  }, [themeInfo]);

  const [bgColor, fgColor, root] = useMemo(() => {
    if (!highlighter || data.data === undefined) {
      return [undefined, undefined, undefined];
    }
    const t = highlighter[0].codeToTokens(JSON.stringify(data.data), { lang: 'json', theme: highlighter[1] });
    return [t.bg, t.fg, calc(data.data, t)];
  }, [data, highlighter]);

  return (
    <>
      {withToaster && <Toaster />}
      <div className={cn('relative overflow-auto scrollbar-thin', props.className)}>
        <pre
          className={cn(
            withButtonGroup ? 'overflow-y-scroll' : 'overflow-auto',
            'scrollbar-thin py-4 text-sm font-mono',
            props.preClassName,
          )}
          style={{ backgroundColor: bgColor, color: fgColor }}
        >
          {data.error ? (
            <div className="px-4" style={{ color: themeInfo.colors?.['editorError.foreground'] }}>
              {data.error}
            </div>
          ) : root !== undefined ? (
            <InnerViewer
              mode={mode}
              themeInfo={themeInfo}
              node={root}
              config={props.config}
              onValueChange={value => {
                setSource(JSON.stringify(value));
                props.onDataChange?.(value);
              }}
            />
          ) : (
            <div className="px-4">
              <LoaderCircle className="animate-spin" />
            </div>
          )}
        </pre>
        {withButtonGroup && !data.error && data.data !== undefined && (
          <div className="absolute right-4 top-2">
            <ButtonGroup>
              {props.title && <div className={buttonVariants({ variant: 'outline' })}>{props.title}</div>}
              <TooltipButton
                tooltip="复制为JSON"
                icon={<CopyIcon />}
                onClick={async () => {
                  await navigator.clipboard.writeText(JSON.stringify(data.data, null, 2));
                  toast.success('复制成功');
                }}
              />
              {!withoutMaximize && (
                <Dialog>
                  <DialogTrigger asChild>
                    <TooltipButton tooltip="弹窗展示" icon={<Maximize />} onClick={async () => {}} />
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    autoFocus={false}
                    onOpenAutoFocus={e => e.preventDefault()}
                    className="w-full !max-w-[80vw]"
                    aria-describedby={undefined}
                  >
                    <DataViewer
                      data={source}
                      className="border-2 rounded-md h-full max-h-[80vh]"
                      preClassName="h-full"
                      onDataChange={data => {
                        setSource(JSON.stringify(data, null, 2));
                        props.onDataChange?.(data);
                      }}
                      config={{ ...props.config, withToaster: false, withoutMaximize: true }}
                    />
                  </DialogContent>
                </Dialog>
              )}
              {!uneditable && (
                <TooltipButton
                  tooltip="切换模式"
                  icon={mode === 'normal' ? <Eye /> : <SquarePen />}
                  onClick={() => setMode(mode === 'normal' ? 'edit' : 'normal')}
                />
              )}
              {withThemeChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'icon',
                      className: 'cursor-pointer bg-white text-gray-600',
                    })}
                  >
                    <Tooltip>
                      <TooltipTrigger
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'icon',
                          className: 'cursor-pointer rounded-none border-x-0 border-y',
                        })}
                        style={{ boxShadow: '0 0' }}
                      >
                        <Palette />
                      </TooltipTrigger>
                      <TooltipContent>切换主题</TooltipContent>
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="scrollbar-thin">
                    <DropdownMenuGroup>
                      {Object.entries(themes).map(([key, value]) => (
                        <DropdownMenuItem
                          key={key}
                          className="cursor-pointer"
                          onClick={() => {
                            setThemeInfo(value as ThemeRegistration);
                            props.onBundledThemeChange?.(value as ThemeRegistration);
                          }}
                        >
                          {key}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'icon',
                    className: 'cursor-pointer bg-white text-gray-600',
                  })}
                >
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(props.data);
                        toast.success('复制成功');
                      }}
                    >
                      复制原始内容
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(JSON5.stringify(data.data, null, 2));
                        toast.success('复制成功');
                      }}
                    >
                      复制为JSON5
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(YAML.stringify(data.data, null, 2));
                        toast.success('复制成功');
                      }}
                    >
                      复制为YAML
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={e => {
                        setWithButtonGroup(false);
                        props.onCloseButtonGroup?.(e.nativeEvent);
                      }}
                    >
                      隐藏工具栏
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        )}
      </div>
    </>
  );
}

export {
  type DataType,
  type DataViewerConfig,
  type DataViewerProps,
  DataViewer,
  type InteractionResult,
  type Interaction,
  trans,
};
