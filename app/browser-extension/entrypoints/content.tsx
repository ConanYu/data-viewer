import '@/styles/globals.css';
import ReactDOM from 'react-dom/client';
import DataViewer from '@/components/ui/conanyu/data-viewer.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const activeAutoDataShowStorageKey = 'local:active_auto_data_show' as const;
    if (!['application/json', 'text/plain'].includes(document.contentType)) {
      return;
    }
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

      document.body.innerHTML = '';
      document.body.style.margin = '0';

      const ui = await createShadowRootUi(ctx, {
        name: 'example-ui',
        position: 'inline',
        anchor: 'body',
        onMount(container) {
          (window as any).__shadow_container = container;
          const root = ReactDOM.createRoot(container);
          root.render(
            <DataViewer
              data={content}
              preClassName="overflow-auto"
              config={{
                withoutMaximize: true,
                withToaster: true,
                disableLocalStorage: true,
                useShikiJavascriptEngine: true,
              }}
            />,
          );
        },
      });
      ui.mount();
    }
  },
});
