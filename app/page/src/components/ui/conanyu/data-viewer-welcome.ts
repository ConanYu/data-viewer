const welcomeData = {
  title: '欢迎使用 Data Viewer',
  tips: [
    '左侧可以输入 JSON、JSON5 或 YAML，右侧会自动识别并结构化展示。',
    '把鼠标移动到可交互值附近，点击圆点可以展开解析结果或打开链接。',
  ],
  features: {
    edit_mode: {
      title: '编辑数据',
      description: '点击右上角的切换模式按钮进入编辑模式，可以新增数据、修改数据、删除数据或移动对象和数组里的数据。',
      steps: ['点击右上角切换模式', '使用节点旁边的按钮修改数据', '编辑结果会同步回左侧输入框并写入浏览器缓存'],
    },
    shadcn_install: {
      title: '在自己的项目中使用',
      description: '项目支持通过 shadcn registry 引入 DataViewer 组件。',
      command:
        'pnpm dlx shadcn@latest add https://raw.githubusercontent.com/ConanYu/data-viewer/refs/heads/main/app/shadcn/data-viewer.json',
      usage:
        'import { DataViewer } from "@/components/ui/conanyu/data-viewer";\n\n<DataViewer title="Demo" data={JSON.stringify(data)} />',
    },
    copy_transform: {
      title: '复制与格式转换',
      description: '右上角菜单提供多种复制方式，可以把当前数据转换后复制到剪贴板。',
      formats: ['原始内容', '压缩 JSON', '转义 JSON', 'JSON5', 'YAML', 'JSON Path', 'JSON Pointer'],
    },
  },
  examples: {
    json_object: {
      type: 'JSON',
      description: '普通对象和数组会直接结构化展示。',
      value: {
        user: 'ConanYu',
        active: true,
        count: 3,
        tags: ['json', 'viewer', 'edit'],
      },
    },
    json5_string: {
      type: 'JSON5',
      description: '字符串中的 JSON5 可以点击圆点解析。',
      value:
        "{\n  // JSON5 支持注释、未加引号的 key 和尾随逗号\n  unquotedKey: 'value',\n  trailingComma: [1, 2, 3,],\n}",
    },
    yaml_string: {
      type: 'YAML',
      description: '字符串中的 YAML 可以点击圆点解析。',
      value: 'name: Data Viewer\nfeatures:\n  - YAML 自动识别\n  - 转换为 JSON 展示\nnested:\n  enabled: true\n',
    },
    base64_string: {
      type: 'Base64',
      description: 'Base64 文本可以点击圆点解码。',
      value: 'SGVsbG8sIERhdGEgVmlld2VyIQ==',
    },
    http_link: {
      type: 'HTTP link',
      description: 'HTTP/HTTPS 字符串可以点击圆点在新标签页打开。',
      value: 'https://github.com/ConanYu/data-viewer',
    },
  },
};

const WELCOME_CONTENT = JSON.stringify(welcomeData, null, 2);

function getInitialDataViewerContent(cachedContent: string | null): string {
  return cachedContent?.trim() ? cachedContent : WELCOME_CONTENT;
}

export { getInitialDataViewerContent, WELCOME_CONTENT };
