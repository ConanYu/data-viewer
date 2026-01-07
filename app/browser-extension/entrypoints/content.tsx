import '@/styles/globals.css';
import ReactDOM from 'react-dom/client';
import DataViewer from '@/components/ui/conanyu/data-viewer.tsx';
import JSON5 from 'json5-bigint';
import YAML from 'yaml';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const activeAutoDataShowStorageKey = 'local:active_auto_data_show' as const;
    const parser = {
      'application/json': JSON5.parse,
      'text/plain': JSON5.parse,
      'application/json5': JSON5.parse,
      'application/yaml': (text: string) => YAML.parse(text, { intAsBigInt: true }),
    }[document.contentType];
    if (!parser) {
      return;
    }
    const activeAutoDataShow = (await storage.getItem(activeAutoDataShowStorageKey)) !== false;
    if (activeAutoDataShow) {
      const getContent = (e: HTMLElement) => {
        let content = '';
        for (const child of e.children) {
          content += child.textContent;
        }
        return content;
      };
      const content = getContent(document.body);
      try {
        const _ = parser(content);
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
              preClassName="overflow-auto h-[100vh]"
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
