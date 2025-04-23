export type AgentState = {
    model:string;
    steps: any[];
    answer:{markdown:string};
    ranked_sources:any[];
}