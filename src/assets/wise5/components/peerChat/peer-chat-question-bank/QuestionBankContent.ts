import { QuestionBank } from './QuestionBank';

export class QuestionBankContent {
  componentId: string;
  nodeId: string;
  questionBank: QuestionBank;

  constructor(nodeId: string, componentId: string, questionBank: QuestionBank) {
    this.nodeId = nodeId;
    this.componentId = componentId;
    this.questionBank = questionBank;
  }
}
