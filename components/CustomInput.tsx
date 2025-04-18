//CustomInput.tsx
import { useAgent } from "@/contexts/agentContext";
import { useModel } from "@/contexts/modelContext";
import { useResearchContext } from "@/lib/research-provider";
import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { InputProps } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
export default function CustomInput({
  inProgress,
  onSend,
  isVisible,
}: InputProps) {

const {setResearchInput,researchInput,setResearchQuery} = useResearchContext();

const {model} = useModel();
const {agent} = useAgent();
const {run: runSearchAgent} = useCoAgent<AgentState>({
  name:agent,
  initialState:{
    model:"gpt-3.5-turbo",
  },
});


  const handleSubmit = (query: string) => {
    setResearchQuery(query);
    runSearchAgent(()=>{
      return new TextMessage({
        role:MessageRole.User,
        content:query
      });
    });

    if (query.trim()) onSend(query);
  };

  const wrapperStyle = "flex gap-2 p-4 border-t";
  const inputStyle =
    "flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 disabled:bg-gray-100";
  const buttonStyle =
    "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed";

  return (
    <div className={wrapperStyle}>
      <input
        disabled={inProgress}
        type="text"
        placeholder="Ask your question here..."
        className={inputStyle}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
      <button
        disabled={inProgress}
        className={buttonStyle}
        onClick={(e) => {
          const input = e.currentTarget
            .previousElementSibling as HTMLInputElement;
          handleSubmit(input.value);
          input.value = "";
        }}
      >
        Ask
      </button>
    </div>
  );
}
