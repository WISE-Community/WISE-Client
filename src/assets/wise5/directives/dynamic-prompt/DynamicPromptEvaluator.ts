import { Observable, concatMap, map } from 'rxjs';
import { Component } from '../../common/Component';
import { PeerGroupStudentData } from '../../../../app/domain/peerGroupStudentData';
import { PeerGroup } from '../../components/peerChat/PeerGroup';
import { DynamicPromptComponent } from './dynamic-prompt.component';
import { FeedbackRuleEvaluator } from '../../components/common/feedbackRule/FeedbackRuleEvaluator';
import { Response } from '../../components/common/feedbackRule/Response';
import { FeedbackRuleEvaluatorMultipleStudents } from '../../components/common/feedbackRule/FeedbackRuleEvaluatorMultipleStudents';
import { FeedbackRuleComponent } from '../../components/feedbackRule/FeedbackRuleComponent';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';

export abstract class DynamicPromptEvaluator {
  constructor(protected component: DynamicPromptComponent) {}

  evaluate(referenceComponent: Component): void {
    if (this.component.dynamicPrompt.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroup(referenceComponent);
    } else {
      this.evaluatePersonal(referenceComponent);
    }
  }

  protected getFeedbackRuleEvaluator(
    referenceComponent: Component
  ): FeedbackRuleEvaluator<Response[]> {
    const evaluator = this.component.dynamicPrompt.isPeerGroupingTagSpecified()
      ? new FeedbackRuleEvaluatorMultipleStudents(
          new FeedbackRuleComponent(
            this.component.dynamicPrompt.getRules(),
            referenceComponent.content.maxSubmitCount,
            false
          ),
          this.component.constraintService
        )
      : new FeedbackRuleEvaluator(
          new FeedbackRuleComponent(
            this.component.dynamicPrompt.getRules(),
            referenceComponent.content.maxSubmitCount,
            false
          ),
          this.component.constraintService
        );
    evaluator.setReferenceComponent(referenceComponent);
    return evaluator;
  }

  protected getPeerGroupData(): Observable<PeerGroupStudentData[]> {
    return this.component.peerGroupService
      .retrievePeerGroup(this.component.dynamicPrompt.getPeerGroupingTag())
      .pipe(
        concatMap((peerGroup: PeerGroup) => {
          return this.component.peerGroupService
            .retrieveDynamicPromptStudentData(
              peerGroup.id,
              this.component.nodeId,
              this.component.componentId
            )
            .pipe(
              map((peerGroupStudentData: PeerGroupStudentData[]) => {
                return peerGroupStudentData;
              })
            );
        })
      );
  }

  protected getSubmitCounter(componentState: any): number {
    return componentState.studentData.submitCounter;
  }

  protected setPromptAndEmitRule(feedbackRule: FeedbackRule): void {
    this.component.prompt = feedbackRule.prompt;
    this.component.dynamicPromptChanged.emit(feedbackRule); // TODO: change to two-way binding variable
  }

  abstract evaluatePeerGroup(referenceComponent: Component): void;
  abstract evaluatePersonal(referenceComponent: Component): void;
}
