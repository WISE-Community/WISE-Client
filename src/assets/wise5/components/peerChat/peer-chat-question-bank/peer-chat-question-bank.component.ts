import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { OpenResponseContent } from '../../openResponse/OpenResponseContent';
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
import { ConstraintService } from '../../../services/constraintService';
import { ConfigService } from '../../../services/configService';

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

  constructor(
    private configService: ConfigService,
    private constraintService: ConstraintService,
    private peerGroupService: PeerGroupService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    if (this.displayedQuestionBankRules == null) {
      const referenceComponent = this.projectService.getReferenceComponent(
        this.content.questionBank
      );
      if (
        this.content.questionBank.isPeerGroupingTagSpecified() &&
        ['MultipleChoice', 'OpenResponse'].includes(referenceComponent.content.type)
      ) {
        this.evaluatePeerGroup(referenceComponent);
      }
    } else {
      this.setQuestions(this.displayedQuestionBankRules);
    }
  }

  private evaluatePeerGroup(referenceComponent: WISEComponent): void {
    const peerGroupRequest = this.peerGroupService.retrievePeerGroup(
      this.content.questionBank.getPeerGroupingTag()
    );
    const peerGroupDataRequest = this.getPeerGroupData(
      this.content.questionBank.getPeerGroupingTag(),
      this.content.nodeId,
      this.content.componentId
    );
    forkJoin([peerGroupRequest, peerGroupDataRequest]).subscribe((response) => {
      const peerGroup = response[0];
      const peerGroupStudentData = response[1];
      const questionBankRules = this.chooseQuestionBankRulesToDisplay(
        referenceComponent,
        peerGroup,
        peerGroupStudentData
      );
      this.displayedQuestionBankRules = questionBankRules;
      this.displayedQuestionBankRulesChange.emit(questionBankRules);
      this.setQuestions(questionBankRules);
    });
  }

  private chooseQuestionBankRulesToDisplay(
    referenceComponent: WISEComponent,
    peerGroup: PeerGroup,
    peerGroupStudentData: PeerGroupStudentData[]
  ): QuestionBankRule[] {
    const responses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
      return new CRaterResponse({
        ideas: peerMemberData.annotation?.data.ideas,
        scores: peerMemberData.annotation?.data.scores,
        submitCounter: peerMemberData.studentWork.studentData.submitCounter
      });
    });
    const feedbackRuleEvaluator = new FeedbackRuleEvaluatorMultipleStudents(
      new FeedbackRuleComponent(
        this.content.questionBank.getRules(),
        (referenceComponent.content as OpenResponseContent).maxSubmitCount,
        false
      ),
      this.configService,
      this.constraintService
    );
    feedbackRuleEvaluator.setReferenceComponent(referenceComponent);
    feedbackRuleEvaluator.setPeerGroup(peerGroup);
    return this.filterQuestions(
      feedbackRuleEvaluator.getFeedbackRules(responses) as QuestionBankRule[],
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
}
