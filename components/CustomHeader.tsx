//CustomHeader.tsx
import { HeaderProps, useChatContext } from "@copilotkit/react-ui";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import "@copilotkit/react-ui/styles.css";
export default function CustomHeader({}: HeaderProps) {
  const { setOpen, icons, labels } = useChatContext();
  

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="w-24">
        <a href="/">
          <BookOpenIcon className="w-6 h-6" />
        </a>
      </div>
      <div className="text-lg">Agent tracking</div>
      <div className="w-24 flex justify-end">
        <button onClick={() => setOpen(false)} aria-label="Close">
          {icons.headerCloseIcon}
        </button>
      </div>
    </div>
  );
}
