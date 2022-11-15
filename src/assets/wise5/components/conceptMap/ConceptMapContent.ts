import { ComponentContent } from '../../common/ComponentContent';

export interface ConceptMapContent extends ComponentContent {
  customRuleEvaluator: any;
  links: any[];
  nodes: any[];
  rules?: any[];
  showAutoFeedback: boolean;
  showAutoScore: boolean;
}
