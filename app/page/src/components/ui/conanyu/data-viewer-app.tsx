import { DataViewer } from '@/components/ui/conanyu/data-viewer.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useEffect, useRef, useState } from 'react';
import type { ThemeRegistration } from 'shiki';
import JSONBigInt from 'json-bigint';
import OneLight from 'tm-themes/themes/one-light.json';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner.tsx';
const JSON = JSONBigInt({ useNativeBigInt: true });

const localStorageContentKey = 'conanyu-data-viewer.content' as const;

export default function DataViewerApp() {
  const [content, setContentState] = useState('');
  const alerted = useRef(false);
  const [useCanvas, setUseCanvas] = useState(false);
  const setContent = (value: string) => {
    setContentState(value);
    const MAX_SIZE = 100 * 1024;
    if (value.length <= MAX_SIZE) {
      localStorage.setItem(localStorageContentKey, value);
      setUseCanvas(false);
    } else {
      if (!alerted.current) {
        toast.warning(`数据内容大小（${value.length}字节）超过最大限制（${MAX_SIZE}字节），将不会保存到浏览器缓存中。`);
        alerted.current = true;
      }
      setUseCanvas(true);
    }
  };
  const [themeInfo, setThemeInfo] = useState<ThemeRegistration | undefined>(undefined);
  useEffect(() => {
    if (localStorage.getItem(localStorageContentKey)) {
      setContentState(localStorage.getItem(localStorageContentKey)!);
    }
  }, []);

  return (
    <div className="m-4">
      <Toaster />
      <div className="grid w-full grid-cols-[max(calc((100%-1rem)/3),300px)_calc(2*max(calc((100%-1rem)/3),300px))] gap-4">
        <div className="h-[calc(100vh-2rem)]">
          <Textarea
            className="h-full resize-none scrollbar-thin bg-gray-100"
            placeholder="输入数据"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="border-2 rounded-md h-[calc(100vh-2rem)]">
          {content.trim() ? (
            <DataViewer
              className="rounded-md h-full"
              preClassName="h-full"
              data={content}
              onThemeInfoChange={theme => {
                setThemeInfo(theme as ThemeRegistration);
              }}
              onDataChange={data => setContent(JSON.stringify(data, null, 2))}
              config={{
                themeInfo,
                withToaster: true,
                useCanvas,
              }}
            />
          ) : (
            <div
              className="h-full rounded-md"
              style={{
                backgroundColor: themeInfo?.colors?.['editor.background'] || OneLight.colors['editor.background'],
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
