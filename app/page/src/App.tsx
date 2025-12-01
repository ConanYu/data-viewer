import { DataViewer } from '@/components/ui/conanyu/data-viewer.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useEffect, useState } from 'react';
import type { ThemeRegistration } from 'shiki';
import VitesseLight from 'tm-themes/themes/vitesse-light.json';
import JSONBigInt from 'json-bigint';
const JSON = JSONBigInt({ useNativeBigInt: true });

const localStorageContentKey = 'conanyu-data-viewer.content' as const;
const localStorageThemeKey = 'conanyu-data-viewer.theme' as const;

export default function App() {
  const [content, setContentState] = useState('');
  const setContent = (value: string) => {
    setContentState(value);
    localStorage.setItem(localStorageContentKey, value);
  };
  const [themeInfo, setThemeInfo] = useState<ThemeRegistration>(VitesseLight as ThemeRegistration);
  useEffect(() => {
    if (localStorage.getItem(localStorageContentKey)) {
      setContentState(localStorage.getItem(localStorageContentKey)!);
    }
    if (localStorage.getItem(localStorageThemeKey)) {
      setThemeInfo(JSON.parse(localStorage.getItem(localStorageThemeKey)!) as ThemeRegistration);
    }
  }, []);

  return (
    <div className="m-4">
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
              onBundledThemeChange={theme => {
                localStorage.setItem(localStorageThemeKey, JSON.stringify(theme));
                setThemeInfo(theme as ThemeRegistration);
              }}
              onDataChange={data => setContent(JSON.stringify(data, null, 2))}
              config={{
                defaultTheme: themeInfo,
                withToaster: true,
                withThemeChange: true,
              }}
            />
          ) : (
            <div
              className="h-full rounded-md"
              style={{ backgroundColor: themeInfo?.colors?.['editor.background'] || '#fff' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
