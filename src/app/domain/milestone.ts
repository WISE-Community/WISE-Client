export interface Milestone {
  id: string;
  nodeId: string;
  componentId: string;
  type: 'milestone' | 'milestoneReport';
  generatedReport?: any;
  generatedRecommendations?: any;
  items: any[];
  isReportAvailable: boolean;
}
