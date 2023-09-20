import { ReferenceComponentRules } from '../../common/ReferenceComponentRules';
import { QuestionBankRule } from './QuestionBankRule';

export class QuestionBank extends ReferenceComponentRules {
  clickToUseEnabled: boolean;
  label: string;
  maxQuestionsToShow: number;
  rules: QuestionBankRule[];
  version: number;
}
