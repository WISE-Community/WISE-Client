export interface ComponentStateWrapper {
  nodeId: string;
  componentId: string;
  componentStatePromise: Promise<any>;
}
