import { DynamicPrompt } from '../directives/dynamic-prompt/DynamicPrompt';

export interface ComponentContent {
  id: string;
  connectedComponents?: any[];
  dynamicPrompt?: DynamicPrompt;
  excludeFromTotalScore?: boolean;
  maxScore?: number;
  prompt?: string;
  rubric?: string;
  showSaveButton?: boolean;
  showSubmitButton?: boolean;
  type: string;
}
