import * as wf from "@temporalio/workflow";

export type WorkflowState<T> = {
    signal: wf.SignalDefinition<[T]>;
    query: wf.QueryDefinition<T, []>;
    value: T;
}