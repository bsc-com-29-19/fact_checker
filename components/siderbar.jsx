//sidebar.tsx
import { useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import { useClickAway } from "react-use";
import { AiOutlineRollback } from "react-icons/ai";
import { Plus } from "lucide-react";

export const Sidebar = ({isOpen,onClose}) => {
   const ref = useRef(null);
   useClickAway(ref, onClose);
  return (
    <>
      <button
        onClick={onClose}
        className="p-2 border-2 border-zinc-800 rounded-xl"
        aria-label="toggle sidebar"
      >
        <GiHamburgerMenu />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        {isOpen && (
          <>
            <motion.div
              {...framerSidebarBackground}
              aria-hidden="true"
              className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-[rgba(242, 235, 235, 0.1)] backdrop-blur-sm"
            ></motion.div>
            <motion.div
              {...framerSidebarPanel}
              className="fixed top-0 bottom-0 left-0 z-50 w-full h-screen max-w-xs border-r-2 border-zinc-800 bg-zinc-900"
              ref={ref}
              aria-label="Sidebar"
            >
              <div className="flex items-center text-white justify-between p-5 border-b-2 border-zinc-800">
                <span className="text-2xl">Fact Checker</span>
                <button className="p-1 rounded hover:bg-gray-400 dark:hover:bg-gray-700">
                  <Plus size={26} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  aria-label="close sidebar"
                >
                  <AiOutlineRollback size={26} />
                </button>
              </div>
              <ul>
                {items.map((item, idx) => {
                  const { title, href, Icon } = item;
                  return (
                    <li key={title}>
                      <a
                        onClick={onClose}
                        href={href}
                        className="flex items-center text-white justify-between gap-5 p-5 transition-all border-b-2 hover:bg-zinc-900 border-zinc-800"
                      >
                        <motion.span {...framerText(idx)}>{title}</motion.span>
                        <motion.div {...framerIcon}>
                          <Icon className="text-2xl text-white" />
                        </motion.div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const items = [
  ////history will be populated here by the user
];

const framerSidebarBackground = {
  initial: { opacity: 0 },
  animate: { opacity: 0 },
  exit: { opacity: 0, transition: { delay: 0.2 } },
  transition: { duration: 0.3 },
};

const framerSidebarPanel = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: { duration: 0.3 },
};

const framerText = (delay) => {
  return {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 0, x: 0 },
    transition: {
      delay: 0.5 + delay / 10,
    },
  };
};

const framerIcon = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
};
