import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { storage } from '#imports';

export default function App() {
  const activeAutoDataShowStorageKey = 'local:active_auto_data_show' as const;
  const [activeAutoDataShow, setActiveAutoDataShowState] = useState(true);
  const setActiveAutoDataShow = async (value: boolean) => {
    setActiveAutoDataShowState(value);
    await storage.setItem(activeAutoDataShowStorageKey, value);
  };
  useEffect(() => {
    storage.getItem(activeAutoDataShowStorageKey).then(value => {
      setActiveAutoDataShowState(value !== false);
    });
  }, []);
  return (
    <div className="p-4 w-48">
      <div className="flex">
        <div
          className="flex gap-2 cursor-pointer"
          onClick={async () => await setActiveAutoDataShow(!activeAutoDataShow)}
        >
          <Checkbox className="cursor-pointer" checked={activeAutoDataShow} />
          <Label className="cursor-pointer">开启自适应数据展示</Label>
        </div>
      </div>
      <div className="mt-3">
        <Button
          size="sm"
          className="cursor-pointer"
          variant="outline"
          onClick={() => browser.runtime.openOptionsPage()}
        >
          打开数据展示页面
        </Button>
      </div>
    </div>
  );
}
