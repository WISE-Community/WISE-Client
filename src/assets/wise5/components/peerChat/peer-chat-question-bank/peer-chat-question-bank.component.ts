import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { OpenResponseContent } from '../../openResponse/OpenResponseContent';
import { QuestionBank } from './QuestionBank';
import { Component as WISEComponent } from '../../../common/Component';
import { PeerGroupStudentData } from '../../../../../app/domain/peerGroupStudentData';
import { CRaterResponse } from '../../common/cRater/CRaterResponse';
import { FeedbackRuleEvaluatorMultipleStudents } from '../../common/feedbackRule/FeedbackRuleEvaluatorMultipleStudents';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { QuestionBankRule } from './QuestionBankRule';
import { concatMap, map } from 'rxjs/operators';
import { PeerGroup } from '../PeerGroup';
import { QuestionBankContent } from './QuestionBankContent';
import { copy } from '../../../common/object/object';
import { Question } from './Question';
import { QuestionBankService } from './questionBank.service';

@Component({
  selector: 'peer-chat-question-bank',
  templateUrl: './peer-chat-question-bank.component.html',
  styleUrls: ['./peer-chat-question-bank.component.scss']
})
export class PeerChatQuestionBankComponent implements OnInit {
  @Input() content: QuestionBankContent;
  @Input() displayedQuestionBankRules: QuestionBankRule[];
  @Output() displayedQuestionBankRulesChange = new EventEmitter<QuestionBankRule[]>();
  @Output() questionClickedEvent = new EventEmitter<string>();
  @Input() questionIdsUsed: string[] = [];
  questions: (string | Question)[];

  constructor(
    private peerGroupService: PeerGroupService,
    private projectService: ProjectService,
    private questionBankService: QuestionBankService
  ) {}

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
      this.setQuestions(this.displayedQuestionBankRules);
    }
    this.subscribeToQuestionUsed();
  }

  private subscribeToQuestionUsed(): void {
    this.questionBankService.questionUsed$.subscribe((question: Question) => {
      this.questionIdsUsed.push(question.id);
    });
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
      this.setQuestions(questionBankRules);
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
    const feedbackRuleEvaluator = new FeedbackRuleEvaluatorMultipleStudents(
      new FeedbackRuleComponent(
        this.content.questionBank.getRules(),
        (referenceComponent.content as OpenResponseContent).maxSubmitCount,
        false
      )
    );
    return this.filterQuestions(
      feedbackRuleEvaluator.getFeedbackRules(cRaterResponses) as QuestionBankRule[],
      this.content.questionBank.maxQuestionsToShow
    );
  }

  private filterQuestions(
    questionBankRules: QuestionBankRule[],
    maxQuestionsToShow: number
  ): QuestionBankRule[] {
    const rules = copy(questionBankRules);
    const filteredRules: QuestionBankRule[] = copy(rules);
    filteredRules.forEach((rule) => (rule.questions = []));
    let numAdded = 0;
    let ruleIndex = 0;
    const totalNumQuestions = rules.map((rule) => rule.questions).flat().length;
    const maxQuestions = maxQuestionsToShow ?? totalNumQuestions;
    while (numAdded < maxQuestions && numAdded != totalNumQuestions) {
      if (rules[ruleIndex].questions.length > 0) {
        const question = rules[ruleIndex].questions.shift();
        filteredRules[ruleIndex].questions.push(question);
        numAdded++;
      }
      ruleIndex = (ruleIndex + 1) % rules.length;
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

  private setQuestions(rules: QuestionBankRule[]): void {
    this.questions = rules.flatMap((rule) => rule.questions);
  }

  protected questionClicked(question: string): void {
    this.questionClickedEvent.emit(question);
  }
}
