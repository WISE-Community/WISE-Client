import { ReferenceComponentRules } from '../../common/ReferenceComponentRules';
import { QuestionBankRule } from './QuestionBankRule';

export class QuestionBank extends ReferenceComponentRules {
  maxQuestionsToShow: number;
  rules: QuestionBankRule[];
}
