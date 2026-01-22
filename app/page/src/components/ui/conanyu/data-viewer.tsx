// https://github.com/conanyu/data-viewer/blob/main/app/page/src/components/ui/conanyu/data-viewer.tsx

'use client';

import JSONBigInt from 'json-bigint';
import JSON5Normal from 'json5';
import JSON5BigInt from 'json5-bigint';
import YAML from 'yaml';
import { ButtonGroup } from '@/components/ui/button-group.tsx';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';
import { buttonVariants } from '@/components/ui/button.tsx';
import {
  CircleArrowUp,
  CircleChevronDown,
  CircleChevronUp,
  CircleMinus,
  CirclePlus,
  CircleQuestionMark,
  CopyIcon,
  Ellipsis,
  EyeOff,
  LoaderCircle,
  Maximize,
  Palette,
  Sparkle,
  SquarePen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner.tsx';
import {
  createHighlighter,
  createJavaScriptRegexEngine,
  type HighlighterGeneric,
  type ThemeRegistration,
  type TokensResult,
} from 'shiki';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { JSONPath } from 'jsonpath-plus';
import { Base64 } from 'js-base64';

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

const isSupportBigInt = typeof BigInt !== 'undefined' && !(window as any).__conanyu_data_viewer_no_bigint;

const JSONHandler = isSupportBigInt ? JSONBigInt({ useNativeBigInt: true }) : JSON;
const JSON5 = isSupportBigInt ? JSON5BigInt : JSON5Normal;

// 转化逻辑
const dataType = ['json', 'json5', 'yaml'] as const;
type DataType = (typeof dataType)[number];

type AutoDetectFunc = (text: string) => unknown;
const autoDetectMap: Record<DataType, AutoDetectFunc> = {
  json: JSONHandler.parse,
  json5: JSON5.parse,
  yaml: (text: string) => YAML.parse(text, { intAsBigInt: isSupportBigInt }),
};

type StringifyFunc = (data: unknown) => string;
const stringifyPrettyMap: Record<DataType, StringifyFunc> = {
  json: (data: unknown) => JSONHandler.stringify(data, null, 2),
  json5: (data: unknown) => JSONHandler.stringify(data, null, 2), // 即使原本是JSON5，也依旧使用JSON序列化
  yaml: (data: unknown) => YAML.stringify(data, { intAsBigInt: isSupportBigInt, indent: 2 }),
};

function autoDetect(props: { data: string; type?: DataType }):
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
        result = autoDetectMap[type](data);
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
    return { type, data: autoDetectMap[type](data), error: undefined };
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

type Interaction = (r: {
  data: unknown;
  depth: number;
  config?: DataViewerConfig;
  onDataChange?: (data: unknown) => void;
  pointer: string;
}) => InteractionResult;

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
          'scrollbar-thin max-h-[80vh] p-4 text-sm font-mono whitespace-pre-wrap break-all',
        )}
        style={{
          backgroundColor: config?.themeInfo?.bg || config?.themeInfo?.colors?.['editor.background'],
          color: config?.themeInfo?.fg || config?.themeInfo?.colors?.['editor.foreground'],
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

const defaultInteraction: Interaction = ({ data, depth, config, onDataChange, pointer }) => {
  const length = collapseLength(data);
  const viewer = (data: unknown, title?: string, callback?: (v: unknown) => void) => {
    return (
      <DataViewerIntl
        data={JSONHandler.stringify(data)}
        title={title}
        config={{ ...config, withToaster: false, withoutMaximize: true }}
        className="border-2 rounded-md"
        preClassName="max-h-[80vh]"
        onDataChange={callback ?? onDataChange}
        pointer={pointer}
      />
    );
  };
  if (depth > 0 && length > 0) {
    return {
      event: viewer(data, 'JSON'),
      title: 'JSON',
    };
  }
  if (typeof data === 'string' && data) {
    if (data.startsWith('https://') || data.startsWith('http://')) {
      return {
        event: () => window.open(data, '_blank'),
        title: '链接',
      };
    }
    const tryParseResult = autoDetect({ data });
    if (typeof tryParseResult.error !== 'string') {
      const { type, data } = tryParseResult;
      if (
        (type !== 'yaml' && !['number', 'bigint'].includes(typeof data)) ||
        (type === 'yaml' && !['string', 'number', 'bigint'].includes(typeof data))
      ) {
        const title = type === 'json' ? 'JSON' : type === 'json5' ? 'JSON5' : 'YAML';
        let callback;
        switch (type) {
          case 'json':
            callback = (v: unknown) => onDataChange?.(JSONHandler.stringify(v));
            break;
          case 'json5':
            callback = (v: unknown) => onDataChange?.(JSON5.stringify(v));
            break;
          case 'yaml':
            callback = (v: unknown) => onDataChange?.(YAML.stringify(v, { intAsBigInt: isSupportBigInt, indent: 2 }));
            break;
        }
        return {
          event: viewer(data, title, callback),
          title,
        };
      }
    }
    try {
      const getValidStringRatio = (str: string): number => {
        if (!str) {
          return 0.0;
        }
        // 定义有效字符的Unicode范围（可根据业务调整）
        // 1. 中文：U+4E00-U+9FFF（中日韩统一表意文字）
        // 2. 中文标点：U+3000-U+303F（全角标点）、U+FF00-U+FFEF（半角全角转换区）
        // 3. 英文/基本符号：U+0020-U+007E（ASCII可打印字符）
        // 4. 换行相关：CR(\r/U+000D)、LF(\n/U+000A)、Unicode行/段落分隔符
        const validCharRegex = /[\u4E00-\u9FFF\u3000-\u303F\uFF00-\uFFEF\u0020-\u007E\r\n\u2028\u2029]/;
        let validCount = 0;
        for (const char of str) {
          if (validCharRegex.test(char)) {
            validCount++;
          }
        }
        // 计算有效字符比例
        return validCount / str.length;
      };
      const decodedString = Base64.decode(data);
      const confidence = getValidStringRatio(decodedString);
      if ((data.length < 10 && confidence >= 1) || (data.length >= 10 && confidence >= 0.99)) {
        return {
          event: viewer(decodedString, 'Base64', v => {
            onDataChange?.(Base64.encode(typeof v === 'string' ? v : JSONHandler.stringify(v)));
          }),
          title: 'Base64',
        };
      }
    } catch (e) {}

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
  onMove?: (e: 'up' | 'down') => void;
  pointer: string;
}

function collapseLength(v: unknown): number {
  return typeof v === 'object' && v !== null ? Object.keys(v).length : 0;
}

const isNotMac = !/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);

function InteractionCircle({
  onClick,
  className,
  themeInfo,
}: {
  onClick: (e: MouseEvent) => void;
  className?: string;
  themeInfo: ThemeRegistration;
}) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className={cn('font-sans select-none cursor-pointer opacity-70 hover:opacity-100', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={e => onClick(e.nativeEvent)}
      style={{
        color: hover
          ? themeInfo.colors?.['button.hoverBackground'] || themeInfo.colors?.['button.background']
          : themeInfo.colors?.['button.background'],
      }}
    >
      <div className={cn('w-2.5 h-2.5 rounded-full bg-current', isNotMac && 'relative top-[0.1rem]')} />
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
        isNotMac && 'top-[-0.1rem]',
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

function UpdateValueDialogContent({
  isArray,
  onSubmitValue,
  config,
  defaultKey,
  defaultValue,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  isArray: boolean;
  onSubmitValue: (k: string, v: unknown) => void;
  config?: DataViewerConfig;
  defaultKey?: string;
  defaultValue?: string;
}) {
  const [key, setKey] = useState(defaultKey || '');
  const [value, setValue] = useState(defaultValue || '"输入数据"');
  const data = useMemo(() => autoDetect({ data: value, type: config?.type }), [value, config?.type]);
  useEffect(() => setKey(defaultKey || ''), [defaultKey]);
  useEffect(() => setValue(defaultValue || '"输入数据"'), [defaultValue]);
  return (
    <DialogContent
      className="w-full !max-w-[60vw]"
      onOpenAutoFocus={e => e.preventDefault()}
      showCloseButton={false}
      aria-describedby={undefined}
      {...props}
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
                disabled={!!defaultKey}
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
            onDataChange={value => {
              for (const type of dataType) {
                if (type === data.type) {
                  setValue(stringifyPrettyMap[type](value));
                  break;
                }
              }
            }}
            config={{ ...config, withToaster: false, withoutMaximize: true }}
          />
          <Button
            className="absolute bottom-3 right-5 cursor-pointer"
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
  const { node, config, themeInfo, mode, onValueChange, onMove, pointer } = props;
  const { forceDefaultCollapseLengthGte, openMove } = config || {};
  const [collapsed, setCollapsed] = useState(node.length > (forceDefaultCollapseLengthGte || 100));
  const [keyHover, setKeyHover] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    setCollapsed(node.length > (forceDefaultCollapseLengthGte || 100));
  }, [node.length, config?.forceDefaultCollapseLengthGte]);

  const interaction = useMemo(() => {
    const props = { data: node.data, depth: node.depth, config, onDataChange: onValueChange, pointer };
    const interaction = config?.additionalInteraction?.(props);
    if (interaction?.highPriority) {
      return interaction;
    }
    return defaultInteraction(props) || interaction;
  }, [node, config?.additionalInteraction]);

  let interactionTrigger: ReactNode = null;

  const updateInteraction = (
    <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} key="interaction-arrow-up">
      <DialogTrigger>
        <CircleArrowUp
          className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mx-0.5"
          style={{ color: themeInfo.colors?.['button.background'] }}
        />
      </DialogTrigger>
      <UpdateValueDialogContent
        isArray={!node.key}
        config={config}
        onSubmitValue={(_, v) => {
          onValueChange(v);
          setUpdateDialogOpen(false);
        }}
        defaultKey={node.key}
        defaultValue={JSONHandler.stringify(node.data, null, 2)}
      />
    </Dialog>
  );

  if (mode === 'normal') {
    if (interaction) {
      interactionTrigger = (
        <InteractionCircle
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
        <span key="interaction">
          <CircleMinus
            key="interaction-minus"
            className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mr-0.5"
            onClick={() => onValueChange(undefined)}
            style={{ color: themeInfo.colors?.['button.background'] }}
          />
          {updateInteraction}
          {openMove && node.collapsedIndex !== 0 && (
            <CircleChevronUp
              key="interaction-move-up"
              className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mx-0.5"
              onClick={() => onMove?.('up')}
              style={{ color: themeInfo.colors?.['button.background'] }}
            />
          )}
          {openMove && node.collapsedIndex !== undefined && node.collapsedIndex + 1 !== node.collapsedLength && (
            <CircleChevronDown
              key="interaction-move-down"
              className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mx-0.5"
              onClick={() => onMove?.('down')}
              style={{ color: themeInfo.colors?.['button.background'] }}
            />
          )}
        </span>
      );
    }
    if (node.data !== null && typeof node.data === 'object') {
      const isArray = Array.isArray(node.data);
      if (interactionTrigger !== null) {
        interactionTrigger = <span className="ml-0.5">{interactionTrigger}</span>;
      }
      interactionTrigger = (
        <span key="interaction-plus">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen} key="interaction-plus">
            <DialogTrigger>
              <CirclePlus
                className="inline-block align-text-top w-3 h-3 mt-0.5 cursor-pointer mr-0.5"
                style={{ color: themeInfo.colors?.['button.background'] }}
              />
            </DialogTrigger>
            <UpdateValueDialogContent
              isArray={isArray}
              config={config}
              onSubmitValue={(k, v) => {
                if (isArray) {
                  (node.data as unknown[]).push(v);
                } else {
                  (node.data as Record<string, unknown>)[k] = v;
                }
                onValueChange(node.data);
                setAddDialogOpen(false);
              }}
            />
          </Dialog>
          {node.depth === 0 && updateInteraction}
          {interactionTrigger}
        </span>
      );
    } else if (node.depth === 0) {
      interactionTrigger = (
        <span key="interaction-update">
          {updateInteraction}
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
            return (
              <span key="interaction-other" className={cn(interactionTrigger && 'mr-1')}>
                {interactionTrigger}
              </span>
            );
          }
          const canCollapse = item.type === ViewerContentTypeKey && node.length > 0;
          return (
            <span
              key={index}
              style={{ color: item.color, backgroundColor: item.bgColor }}
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
                pointer={
                  pointer + (item.key ? `/${item.key.replaceAll('~', '~0').replaceAll('/', '~1')}` : `/${index}`)
                }
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
                onMove={e => {
                  let data = node.data;
                  if (data !== null) {
                    const swap = (arr: unknown[], i: number, j: number) => {
                      const temp = arr[i];
                      arr[i] = arr[j];
                      arr[j] = temp;
                    };
                    const otherIndex = e === 'up' ? index - 1 : index + 1;
                    if (Array.isArray(data)) {
                      swap(data, index, otherIndex);
                    } else if (typeof data === 'object') {
                      const newDataTemp = Object.entries(data);
                      swap(newDataTemp, index, otherIndex);
                      data = Object.fromEntries(newDataTemp);
                    }
                  }
                  onValueChange(data);
                }}
              />
            ))}
          </div>
        ) : null}
        {node.after.map((item, index) => (
          <span key={index} style={{ color: item.color, backgroundColor: item.bgColor }}>
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
  bgColor?: string;
  type: ViewerContentType;
}

interface ViewerNode {
  key?: string;
  data: unknown;
  length: number;
  depth: number;
  collapsedIndex?: number;
  collapsedLength?: number;
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
  collapsedIndex?: number;
  collapsedLength?: number;
  highlightPointer?: string[]; // 保证已排序
  highlightColor: string;
  pointer: string;
}): [ViewerNode, number] {
  const { data, color, from, depth, key, collapsedIndex, collapsedLength, highlightPointer, highlightColor } = props;
  const length = collapseLength(data);
  const node: ViewerNode = {
    key,
    data,
    length,
    depth,
    collapsedIndex,
    collapsedLength,
    before: [],
    children: [],
    after: [],
  };
  let dfsIndex = from;
  const highlightType: 'none' | 'partial' | 'all' = (() => {
    if (highlightPointer && highlightPointer.length > 0) {
      let left = 0,
        right = highlightPointer.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (props.pointer === highlightPointer[mid]) {
          return 'partial';
        } else if (props.pointer.startsWith(highlightPointer[mid])) {
          return 'all';
        } else if (highlightPointer[mid] < props.pointer) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    }
    return 'none';
  })();
  const toViewerContent = (s: string, type?: ViewerContentType) => {
    const current: ViewerContent[] = [];
    const bgColor =
      highlightType === 'all' || (highlightType === 'partial' && type !== ViewerContentTypeKey)
        ? highlightColor
        : undefined;
    for (const c of s) {
      const lastColor = current?.[current.length - 1]?.color;
      const lastBgColor = current?.[current.length - 1]?.bgColor;
      const currentColor = color?.[dfsIndex];
      if (lastColor === currentColor && lastBgColor === bgColor) {
        current[current.length - 1].content += c;
      } else {
        current.push({ content: c, color: currentColor, bgColor, type: type || ViewerContentTypeNormal });
      }
      dfsIndex++;
    }
    return current;
  };
  if (key !== undefined) {
    const current = toViewerContent(JSONHandler.stringify(key), ViewerContentTypeKey);
    node.before.push(...current, {
      content: ': ',
      color: color?.[dfsIndex],
      type: ViewerContentTypeNormal,
      bgColor: highlightType === 'all' ? highlightColor : undefined,
    });
    dfsIndex++;
  }
  node.before.push({ content: '', type: ViewerContentTypeInteraction });
  if (typeof data === 'string') {
    node.before.push(...toViewerContent(JSONHandler.stringify(data)));
  } else if (typeof data === 'number' || typeof data === 'bigint' || typeof data === 'boolean' || data === null) {
    const text = data === null ? 'null' : data.toString();
    node.before.push(...toViewerContent(text));
  } else if (data instanceof Array) {
    if (length > 0) {
      node.before.push(...toViewerContent('['));
      for (let i = 0; i < length; i++) {
        const [child, newDfsIndex] = calcDfs({
          data: data[i],
          color,
          from: dfsIndex,
          depth: depth + 1,
          collapsedIndex: i,
          collapsedLength: length,
          highlightPointer,
          highlightColor,
          pointer: props.pointer + `/${i}`,
        });
        node.children.push(child);
        dfsIndex = newDfsIndex;
      }
      node.after.push(...toViewerContent(']'));
    } else {
      node.before.push(...toViewerContent('[]'));
    }
  } else if (typeof data === 'object') {
    if (length > 0) {
      node.before.push(...toViewerContent('{'));
      Object.entries(data).forEach(([key, son], i) => {
        const [child, newDfsIndex] = calcDfs({
          data: son,
          color,
          from: dfsIndex,
          depth: depth + 1,
          key,
          collapsedIndex: i,
          collapsedLength: length,
          highlightPointer,
          highlightColor,
          pointer: props.pointer + `/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`,
        });
        node.children.push(child);
        dfsIndex = newDfsIndex;
      });
      node.after.push(...toViewerContent('}'));
    } else {
      node.before.push(...toViewerContent('{}'));
    }
  }
  if (collapsedIndex !== undefined && collapsedIndex + 1 !== collapsedLength) {
    node.after.push({
      content: ',',
      color: color?.[dfsIndex],
      type: ViewerContentTypeNormal,
      bgColor: highlightType === 'all' ? highlightColor : undefined,
    });
    dfsIndex++;
  }

  return [node, dfsIndex];
}

function calc(
  data: unknown,
  t: TokensResult,
  highlightPointer: string[] | undefined,
  highlightColor: string,
): ViewerNode {
  const color: (string | undefined)[] = [];
  for (const t1 of t.tokens) {
    for (const t2 of t1) {
      for (const _ of t2.content) {
        color.push(t2.color);
      }
    }
  }
  return calcDfs({ data, color, from: 0, depth: 0, highlightPointer, highlightColor, pointer: '' })[0];
}

function JsonPathDialogContent({
  source,
  config,
  pointer,
}: {
  source: unknown;
  config?: DataViewerConfig;
  pointer: string;
}) {
  const [jsonPath, setJsonPath] = useState('$');
  const json = useMemo(() => JSONHandler.stringify(source), [source]);
  const result: string | { value: unknown; pointer: string }[] = useMemo(() => {
    try {
      return JSONPath({ path: jsonPath || '$', json: source!, resultType: 'all', wrap: true, ignoreEvalErrors: true });
    } catch (e) {
      return `${e}`;
    }
  }, [jsonPath, json]);
  const dataViewerConfig = {
    ...config,
    uneditable: true,
    withoutMaximize: true,
    withToaster: false,
    withThemeChange: false,
  };
  return (
    <DialogContent
      showCloseButton={false}
      autoFocus={false}
      onOpenAutoFocus={e => e.preventDefault()}
      className="w-full !max-w-[80vw] max-h-[80vh]"
      aria-describedby={undefined}
    >
      <VisuallyHidden asChild>
        <DialogTitle />
      </VisuallyHidden>
      <div className="w-[calc(80vw-3rem)]">
        <InputGroup>
          <InputGroupInput placeholder="$" value={jsonPath} onChange={e => setJsonPath(e.target.value)} />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger>
                <InputGroupButton
                  className="rounded-full cursor-pointer"
                  size="icon-xs"
                  onClick={() => {
                    window.open('https://github.com/JSONPath-Plus/JSONPath/blob/main/README.md', '_blank');
                  }}
                >
                  <CircleQuestionMark />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>规则详情</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-[calc((80vw-4rem)/3)]">
          <DataViewerIntl
            data={json}
            config={dataViewerConfig}
            className="rounded-md"
            preClassName="rounded-md border-2 max-h-[calc(80vh-8rem)]"
            pointer={pointer}
            highlightPointer={
              typeof result !== 'string'
                ? result?.map(item => item.pointer)?.sort((a, b) => (a < b ? -1 : a == b ? 0 : 1))
                : undefined
            }
          />
        </div>
        <div className="w-[calc((80vw-4rem)/3*2)]">
          {typeof result === 'string' ? (
            <div
              className="p-4 rounded-md border-2 h-full max-h-[calc(80vh-8rem)] font-mono"
              style={{ color: config?.themeInfo?.colors?.['editorError.foreground'] }}
            >
              {result}
            </div>
          ) : (
            <DataViewerIntl
              data={JSONHandler.stringify(result?.map(item => item.value))}
              config={dataViewerConfig}
              className="rounded-md"
              preClassName="rounded-md border-2 max-h-[calc(80vh-8rem)]"
              pointer=""
            />
          )}
        </div>
      </div>
    </DialogContent>
  );
}

// 入口组件
interface DataViewerConfig {
  type?: DataType; // 强制制定数据类型 不填则根据数据自动判断
  themeInfo?: ThemeRegistration; // 默认自定义主题 默认为one-light
  withoutButtonGroup?: boolean; // 是否不展示操作按钮组
  withToaster?: boolean; // 是否需要toaster
  withoutMaximize?: boolean; // 是否不展示最大化按钮
  withThemeChange?: boolean; // 是否开启主题切换
  forceDefaultCollapseLengthGte?: number; // 强制默认折叠长度 不填则为100
  showInteractionWithStringLengthGte?: number; // 展示交互的字符串长度阈值 不填则为100
  additionalInteraction?: Interaction; // 自定义交互逻辑
  uneditable?: boolean; // 是否可编辑
  openMove?: boolean; // 默认是否开启移动操作
  disableLocalStorage?: boolean; // 是否禁用localStorage
  useShikiJavascriptEngine?: boolean; // 使用shiki javascript引擎
}

interface DataViewerProps {
  data: string;
  className?: string;
  preClassName?: string;
  title?: string;
  onDataChange?: (data: unknown) => void; // 数据编辑回调
  onThemeInfoChange?: (theme: ThemeRegistration) => void; // 默认主题切换回调
  onCloseButtonGroup?: (e: MouseEvent) => void; // 关闭工具栏回调
  onOpenMoveChange?: (openMove: boolean) => void; // 移动操作展开状态改变回调
  config?: DataViewerConfig;
}

interface DataViewerIntlProps extends DataViewerProps {
  pointer: string; // https://datatracker.ietf.org/doc/html/rfc6901
  highlightPointer?: string[];
}

const localStorageThemeKey = 'conanyu-data-viewer.theme' as const;
const localStorageOpenMoveKey = 'conanyu-data-viewer.open-move' as const;

const globalHighlighter: Map<ThemeRegistration, HighlighterGeneric<string, string>> = new Map();

function DataViewerIntl(props: DataViewerIntlProps) {
  // 处理配置
  const {
    type,
    themeInfo: propThemeInfo,
    withoutButtonGroup,
    withoutMaximize,
    withToaster,
    withThemeChange,
    uneditable,
    openMove: propOpenMove,
    disableLocalStorage,
    useShikiJavascriptEngine,
  } = props.config || {};
  const getThemeInfo = () => {
    return (
      propThemeInfo ??
      (() => {
        if (disableLocalStorage) {
          return null;
        }
        const theme = localStorage.getItem(localStorageThemeKey);
        return theme === null ? null : (JSON5.parse(theme) as ThemeRegistration);
      })() ??
      (OneLight as ThemeRegistration)
    );
  };
  const [themeInfo, setThemeInfo] = useState<ThemeRegistration>(getThemeInfo());
  useEffect(() => {
    setThemeInfo(getThemeInfo());
  }, [propThemeInfo]);
  const [withButtonGroup, setWithButtonGroup] = useState(!withoutButtonGroup);
  const [source, setSource] = useState(props.data);
  useEffect(() => {
    setSource(props.data);
  }, [props.data]);
  const [mode, setMode] = useState<'normal' | 'edit'>('normal');
  const getOpenMove = () => {
    return (
      propOpenMove ??
      (() => {
        if (disableLocalStorage) {
          return null;
        }
        const openMove = localStorage.getItem(localStorageOpenMoveKey);
        return openMove === null ? null : openMove === 'true';
      })() ??
      false
    );
  };
  const [openMove, setOpenMove] = useState(getOpenMove());
  useEffect(() => {
    setOpenMove(getOpenMove());
  }, [propOpenMove]);
  const [jsonPathDialogOpen, setJsonPathDialogOpen] = useState(false);

  // 处理转化逻辑
  const data = useMemo(() => autoDetect({ data: source, type: type }), [source, type]);

  // 处理样式
  const [highlighter, setHighlighter] = useState<[HighlighterGeneric<string, string>, ThemeRegistration] | undefined>(
    undefined,
  );

  useEffect(() => {
    const theme = themeInfo;
    (async () => {
      const cachedHighlighter = globalHighlighter.get(theme);
      if (cachedHighlighter) {
        setHighlighter([cachedHighlighter, theme]);
      } else {
        const highlighter = (await createHighlighter(
          useShikiJavascriptEngine
            ? { langs: ['json'], themes: [theme], engine: createJavaScriptRegexEngine() }
            : { langs: ['json'], themes: [theme] },
        )) as HighlighterGeneric<string, string>;
        setHighlighter([highlighter, theme]);
        globalHighlighter.set(theme, highlighter);
      }
    })();
  }, [themeInfo]);

  const [bgColor, fgColor, root] = useMemo(() => {
    if (!highlighter || data.data === undefined) {
      return [
        themeInfo?.bg || themeInfo?.colors?.['editor.background'],
        themeInfo?.fg || themeInfo?.colors?.['editor.foreground'],
        undefined,
      ];
    }
    const t = highlighter[0].codeToTokens(JSONHandler.stringify(data.data), { lang: 'json', theme: highlighter[1] });
    let r: ViewerNode | undefined = undefined;
    try {
      r = calc(
        data.data,
        t,
        props.highlightPointer,
        themeInfo.colors?.['editor.findMatchHighlightBackground'] || '"#0000000C"',
      );
    } catch (e) {
      console.error(e);
      toast.error(`非预期错误：${e}`);
    }
    return [t.bg, t.fg, r];
  }, [data, highlighter, themeInfo, props.highlightPointer]);

  return (
    <>
      {withToaster && <Toaster />}
      <div className={cn('relative overflow-auto scrollbar-thin', props.className)}>
        <pre
          className={cn(
            withButtonGroup ? 'overflow-y-scroll' : 'overflow-auto',
            'scrollbar-thin py-4 text-sm font-mono font-normal antialiased',
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
              config={{ ...props.config, openMove }}
              onValueChange={value => {
                setSource(JSONHandler.stringify(value));
                props.onDataChange?.(value);
              }}
              pointer={props.pointer}
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
                  await navigator.clipboard.writeText(JSONHandler.stringify(data.data, null, 2));
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
                    <DataViewerIntl
                      data={source}
                      className="border-2 rounded-md h-full max-h-[80vh]"
                      preClassName="h-full"
                      onDataChange={value => {
                        setSource(stringifyPrettyMap[data.type](value));
                        props.onDataChange?.(value);
                      }}
                      config={{ ...props.config, withToaster: false, withoutMaximize: true }}
                      pointer={props.pointer}
                    />
                  </DialogContent>
                </Dialog>
              )}
              {!uneditable && (
                <TooltipButton
                  tooltip="切换模式"
                  icon={mode === 'normal' ? <Sparkle /> : <SquarePen />}
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
                            props.onThemeInfoChange?.(value as ThemeRegistration);
                            if (!disableLocalStorage) {
                              localStorage.setItem(localStorageThemeKey, JSON5.stringify(value));
                            }
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
                  <DropdownMenuLabel>操作</DropdownMenuLabel>
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
                        await navigator.clipboard.writeText(JSONHandler.stringify(data.data));
                        toast.success('复制成功');
                      }}
                    >
                      复制为压缩JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(JSONHandler.stringify(JSONHandler.stringify(data.data)));
                        toast.success('复制成功');
                      }}
                    >
                      复制为转义JSON
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
                        await navigator.clipboard.writeText(
                          YAML.stringify(data.data, { intAsBigInt: isSupportBigInt, indent: 2 }),
                        );
                        toast.success('复制成功');
                      }}
                    >
                      复制为YAML
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        const jsonPath =
                          '$' +
                          props.pointer
                            .split('/')
                            .slice(1)
                            .map(item => `['${item.replaceAll('~0', '~').replaceAll('~1', '/')}']`)
                            .join('');
                        await navigator.clipboard.writeText(jsonPath);
                        toast.success(`复制成功（${jsonPath}）`);
                      }}
                    >
                      复制JSON Path
                    </DropdownMenuItem>
                    {props.pointer.length > 0 && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async () => {
                          await navigator.clipboard.writeText(props.pointer);
                          toast.success(`复制成功（${props.pointer}）`);
                        }}
                      >
                        复制JSON Pointer
                        <DropdownMenuShortcut
                          className="cursor-help"
                          onClick={e => {
                            e.stopPropagation();
                            window.open('https://datatracker.ietf.org/doc/html/rfc6901', '_blank');
                          }}
                        >
                          <CircleQuestionMark />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer" onSelect={() => setJsonPathDialogOpen(true)}>
                      根据JSON Path展示
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
                  {!uneditable && (
                    <>
                      <DropdownMenuLabel>设置</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem
                          checked={openMove}
                          className="cursor-pointer"
                          onCheckedChange={checked => {
                            setOpenMove(checked);
                            props.onOpenMoveChange?.(checked);
                            if (!disableLocalStorage) {
                              localStorage.setItem(localStorageOpenMoveKey, checked ? 'true' : 'false');
                            }
                          }}
                        >
                          开启移动
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        )}
      </div>
      <Dialog open={jsonPathDialogOpen} onOpenChange={setJsonPathDialogOpen}>
        <JsonPathDialogContent source={data.data} config={props.config} pointer={props.pointer} />
      </Dialog>
    </>
  );
}

function DataViewer(props: DataViewerProps) {
  return <DataViewerIntl {...props} pointer="" />;
}

export default DataViewer;

export {
  type DataType,
  type DataViewerConfig,
  type DataViewerProps,
  DataViewer,
  type InteractionResult,
  type Interaction,
  autoDetect,
};
