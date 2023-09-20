import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { Question } from './Question';

export class QuestionBankRule extends FeedbackRule {
  questions: (string | Question)[];
}
