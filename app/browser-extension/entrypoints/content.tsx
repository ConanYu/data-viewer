import { storage } from '#imports';
import ReactDOM from 'react-dom/client';
import '@/styles/globals.css';
import DataViewer from '@/components/ui/conanyu/data-viewer.tsx';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    const activeAutoDataShowStorageKey = 'local:active_auto_data_show' as const;
    const script = async () => {
      const activeAutoDataShow = (await storage.getItem(activeAutoDataShowStorageKey)) !== false;
      if (activeAutoDataShow) {
        const getContent = (e: HTMLElement) => {
          let content = '';
          for (const child of e.children) {
            if (child.tagName === 'PRE') {
              content += child.textContent;
            }
          }
          return content;
        };
        const content = getContent(document.body);
        try {
          JSON.parse(content);
        } catch (e) {
          return;
        }
        console.log(content, 'data-viewer-content');

        // 1. 清空原页面内容（若需保留部分元素，可替换为特定 DOM 操作）
        document.body.innerHTML = '';

        // 2. 创建 React 挂载容器
        const container = document.createElement('div');
        // 将容器加入 body
        document.body.appendChild(container);

        // 3. 挂载 React 组件（React 18+ 写法）
        const root = ReactDOM.createRoot(container);
        root.render(
          <DataViewer
            data={content}
            preClassName="overflow-auto"
            config={{
              withoutMaximize: true,
              withThemeChange: true,
              withToaster: true,
            }}
          />,
        );
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', script);
    } else {
      script();
    }
  },
});
