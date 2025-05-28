//CustomMessage.tsx
import { UserMessageProps } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export const CustomUserMessage = (props: UserMessageProps) => {
  const wrapperStyles = "flex items-center gap-2 justify-end mb-4";
  const messageStyles =
    "bg-blue-500 text-white py-2 px-4 rounded-xl break-words flex-shrink-0 max-w-[80%]";
  const avatarStyles =
    "bg-blue-500 shadow-sm min-h-10 min-w-10 rounded-full text-white flex items-center justify-center";

  // Add a condition to disable the user message
  const disableUserMessage = true; // Set this to `false` to re-enable

  if (disableUserMessage) {
    return null; // Return nothing to disable the message
  }

  return (
    <div className={wrapperStyles}>
      <div className={messageStyles}>{props.message}</div>
      <div className={avatarStyles}>TS</div>
    </div>
  );
};