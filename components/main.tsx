// components/main.tsx
import React, { useEffect } from "react";
// import Button from "@/components/button";
import { useModel } from "@/contexts/modelContext";
import { useAgent } from "@/contexts/agentContext";
// import { useLanguage } from "@/contexts/languageContext";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import { AnswerMarkdown } from "./AnswerMarkdown";

const FactCheckComponent = ({
  claim,
  trueStatement,
  falseStatement,
  wholeTruth,
}: {
  claim: string;
  trueStatement: string;
  falseStatement: string;
  wholeTruth: string;
}) => {
  const { model } = useModel();
  const { agent } = useAgent();
  // const { language } = useLanguage();

  const { state: agentState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
    },
  });

  const steps =
    agentState?.steps?.map((step: any) => {
      return {
        description: step.description || "",
        status: step.status || "pending",
        updates: step.updates || [],
      };
    }) || [];

  const isLoading = !agentState?.answer?.markdown;

  useEffect(() => {
    console.log("Current agent state:", agentState);
  }, [agentState]);

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <strong>Claim:</strong> {claim}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          Claim Decomposition:
        </h2>
        <p>
          <strong>True:</strong> {trueStatement}
        </p>
        <p>
          <strong>False:</strong> {agent} {falseStatement}
        </p>
      </div>
      <div>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Whole Truth:</h2>
        <p>{wholeTruth}</p>
      </div>
      {/* button for sources will be here */}
      {/* <div>
        <Button variant="primary">View Sources</Button>
      </div> */}
      <div className="flex items-center justify-center">
        {isLoading ? null : <div>{agentState?.answer?.markdown}</div>}
      </div>
      {isLoading ? null : (
        <AnswerMarkdown markdown={agentState?.answer?.markdown} />
      )}
    </div>
  );
};

export default FactCheckComponent;
