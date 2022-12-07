import { Component } from '../../common/Component';
import { QuestionBank } from './peer-chat-question-bank/QuestionBank';
import { QuestionBankContent } from './peer-chat-question-bank/QuestionBankContent';
import { PeerChatContent } from './PeerChatContent';

export class PeerChatComponent extends Component {
  content: PeerChatContent;

  getPeerGroupingTag(): string {
    return this.content.peerGroupingTag;
  }

  getQuestionBankContent(): QuestionBankContent {
    return this.content.questionBank != null
      ? new QuestionBankContent(this.nodeId, this.id, new QuestionBank(this.content.questionBank))
      : null;
  }
}
