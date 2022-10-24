import { ComponentContent } from '../../common/ComponentContent';

export interface MultipleChoiceContent extends ComponentContent {
  choices: any[];
  choiceType: 'checkbox' | 'radio';
}
