import { QuestionBank } from '../components/peerChat/peer-chat-question-bank/QuestionBank';
import { DynamicPrompt } from '../directives/dynamic-prompt/DynamicPrompt';

export interface ComponentContent {
  id: string;
  connectedComponents?: any[];
  dynamicPrompt?: DynamicPrompt;
  excludeFromTotalScore?: boolean;
  maxScore?: number;
  maxSubmitCount?: number;
  prompt?: string;
  questionBank?: QuestionBank;
  rubric?: string;
  showSaveButton?: boolean;
  showSubmitButton?: boolean;
  type: string;
}

export function hasConnectedComponent(
  content: ComponentContent,
  connectedComponentType: 'importWork' | 'showWork'
): boolean {
  return (
    content.connectedComponents != null &&
    content.connectedComponents.some((c) => c.type === connectedComponentType)
  );
}
