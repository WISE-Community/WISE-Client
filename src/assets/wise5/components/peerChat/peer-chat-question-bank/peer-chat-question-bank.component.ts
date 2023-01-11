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
  @Input() displayedQuestionBankRules: QuestionBankRule[];
  @Output() displayedQuestionBankRulesChange = new EventEmitter<QuestionBankRule[]>();
  questions: string[];

  constructor(private peerGroupService: PeerGroupService, private projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.displayedQuestionBankRules == null) {
      const referenceComponent = this.getReferenceComponent(this.content.questionBank);
      if (
        this.content.questionBank.isPeerGroupingTagSpecified() &&
        referenceComponent.content.type === 'OpenResponse'
      ) {
        this.evaluatePeerGroup(referenceComponent);
      }
    } else {
      this.setQuestions();
    }
  }

  private getReferenceComponent(questionBank: QuestionBank): WISEComponent {
    const nodeId = questionBank.getReferenceNodeId();
    const componentId = questionBank.getReferenceComponentId();
    return new WISEComponent(this.projectService.getComponent(nodeId, componentId), nodeId);
  }

  private evaluatePeerGroup(referenceComponent: WISEComponent): void {
    this.getPeerGroupData(
      this.content.questionBank.getPeerGroupingTag(),
      this.content.nodeId,
      this.content.componentId
    ).subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const questionBankRules = this.chooseQuestionBankRulesToDisplay(
        referenceComponent,
        peerGroupStudentData
      );
      this.displayedQuestionBankRules = questionBankRules;
      this.displayedQuestionBankRulesChange.emit(questionBankRules);
      this.setQuestions();
    });
  }

  private chooseQuestionBankRulesToDisplay(
    referenceComponent: WISEComponent,
    peerGroupStudentData: PeerGroupStudentData[]
  ): QuestionBankRule[] {
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
    return this.filterQuestions(
      feedbackRuleEvaluator.getFeedbackRules(cRaterResponses) as QuestionBankRule[]
    );
  }

  private filterQuestions(questionBankRules: QuestionBankRule[]): QuestionBankRule[] {
    const filteredRules: QuestionBankRule[] = JSON.parse(JSON.stringify(questionBankRules));
    filteredRules.forEach((rule) => (rule.questions = []));
    let numAdded = 0;
    let ruleIndex = 0;
    const totalNumQuestions = questionBankRules.map((rule) => rule.questions).flat().length;
    const maxQuestionsToShow = this.content.questionBank.maxQuestionsToShow;
    while (numAdded < maxQuestionsToShow && numAdded != totalNumQuestions) {
      if (questionBankRules[ruleIndex].questions.length > 0) {
        const question = questionBankRules[ruleIndex].questions.shift();
        filteredRules[ruleIndex].questions.push(question);
        numAdded++;
      }
      ruleIndex = (ruleIndex + 1) % questionBankRules.length;
    }
    return filteredRules.filter((rule) => rule.questions.length > 0);
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

  private setQuestions(): void {
    this.questions = this.displayedQuestionBankRules.flatMap((rule) => rule.questions);
  }
}
