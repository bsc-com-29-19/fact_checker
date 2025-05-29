import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";
import { langGraphPlatformEndpoint } from "@copilotkit/runtime";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const serviceAdapter = new OpenAIAdapter({ openai } as any);

const deploymentUrl = process.env.LGC_DEPLOYMENT_URL as string;
const langsmithApiKey = process.env.LANGSMITH_API_KEY as string;

const runtime = new CopilotRuntime({
  remoteEndpoints: [
    langGraphPlatformEndpoint({
      deploymentUrl,
      langsmithApiKey,
      agents: [
        {
          name: "fact_checker_agent",
          description:
            "A LangGraph AI agent that provides fact checking capabilities using the CoPilotKit packages.",
          assistantId: "fe096781-5601-53d2-b2f6-0d3403f7e9ca",
          //   assistantId: "47cee9d-9eeb-44ed-a5c5-678c30072b74",
        },
      ],
    }),
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit-lgc",
  });

  return handleRequest(req);
};
