import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { OpenResponseContent } from '../../openResponse/OpenResponseContent';
import { QuestionBank } from './QuestionBank';
import { Component as WISEComponent } from '../../../common/Component';
import { PeerGroupStudentData } from '../../../../../app/domain/peerGroupStudentData';
import { CRaterResponse } from '../../common/cRater/CRaterResponse';
import { FeedbackRuleEvaluator } from '../../common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { QuestionBankRule } from './QuestionBankRule';
import { concatMap, map } from 'rxjs/operators';
import { PeerGroup } from '../PeerGroup';
import { QuestionBankContent } from './QuestionBankContent';

@Component({
  selector: 'peer-chat-question-bank',
  templateUrl: './peer-chat-question-bank.component.html',
  styleUrls: ['./peer-chat-question-bank.component.scss']
})
export class PeerChatQuestionBankComponent implements OnInit {
  @Input() content: QuestionBankContent;
  @Input() displayedQuestionBankRule: QuestionBankRule;
  @Output() displayedQuestionBankRuleChange = new EventEmitter<QuestionBankRule>();
  questions: string[];

  constructor(private peerGroupService: PeerGroupService, private projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.displayedQuestionBankRule != null) {
      this.questions = this.displayedQuestionBankRule.questions;
    } else {
      const referenceComponent = this.getReferenceComponent(this.content.questionBank);
      if (referenceComponent.content.type === 'OpenResponse') {
        this.evaluate(referenceComponent);
      }
    }
  }

  private getReferenceComponent(questionBank: QuestionBank): WISEComponent {
    const nodeId = questionBank.getReferenceNodeId();
    const componentId = questionBank.getReferenceComponentId();
    return new WISEComponent(this.projectService.getComponent(nodeId, componentId), nodeId);
  }

  private evaluate(referenceComponent: WISEComponent): void {
    if (this.content.questionBank.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroup(referenceComponent);
    }
  }

  private evaluatePeerGroup(referenceComponent: WISEComponent): void {
    this.getPeerGroupData(
      this.content.questionBank.getPeerGroupingTag(),
      this.content.nodeId,
      this.content.componentId
    ).subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const cRaterResponses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
        return new CRaterResponse({
          ideas: peerMemberData.annotation.data.ideas,
          scores: peerMemberData.annotation.data.scores,
          submitCounter: peerMemberData.studentWork.studentData.submitCounter
        });
      });
      const feedbackRuleEvaluator = new FeedbackRuleEvaluator(
        new FeedbackRuleComponent(
          this.content.questionBank.getRules(),
          (referenceComponent.content as OpenResponseContent).maxSubmitCount,
          false
        )
      );
      const feedbackRule: QuestionBankRule = feedbackRuleEvaluator.getFeedbackRule(
        cRaterResponses
      ) as QuestionBankRule;
      this.questions = feedbackRule.questions;
      this.displayedQuestionBankRuleChange.emit(feedbackRule);
    });
  }

  private getPeerGroupData(
    peerGroupingTag: string,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.peerGroupService.retrievePeerGroup(peerGroupingTag).pipe(
      concatMap((peerGroup: PeerGroup) => {
        return this.peerGroupService
          .retrieveQuestionBankStudentData(peerGroup.id, nodeId, componentId)
          .pipe(
            map((peerGroupStudentData: PeerGroupStudentData[]) => {
              return peerGroupStudentData;
            })
          );
      })
    );
  }
}
