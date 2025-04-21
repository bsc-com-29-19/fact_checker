//CustomHeader.tsx
import { HeaderProps, useChatContext } from "@copilotkit/react-ui";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import "@copilotkit/react-ui/styles.css";
import Link from "next/link";
export default function CustomHeader({}: HeaderProps) {
  const { setOpen, icons, labels } = useChatContext();

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="w-24">
        <Link href="/">
          <BookOpenIcon className="w-6 h-6" />
        </Link>
      </div>
      <div className="text-lg">Fact Checker</div>
      <div className="w-24 flex justify-end">
        <button onClick={() => setOpen(false)} aria-label="Close">
          {icons.headerCloseIcon}
        </button>
      </div>
    </div>
  );
}
