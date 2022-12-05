import { ComponentContent } from '../../common/ComponentContent';
import { Choice } from './Choice';

export interface MultipleChoiceContent extends ComponentContent {
  choices: Choice[];
  choiceType: 'checkbox' | 'radio';
  showFeedback: boolean;
}
