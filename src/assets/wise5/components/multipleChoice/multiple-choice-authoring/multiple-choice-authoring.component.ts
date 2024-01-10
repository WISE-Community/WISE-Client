import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { RandomKeyService } from '../../../services/randomKeyService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'multiple-choice-authoring',
  templateUrl: 'multiple-choice-authoring.component.html',
  styleUrls: ['multiple-choice-authoring.component.scss']
})
export class MultipleChoiceAuthoring extends ComponentAuthoring {
  allowedConnectedComponentTypes = ['MultipleChoice'];
  choiceTextChange: Subject<string> = new Subject<string>();
  feedbackTextChange: Subject<string> = new Subject<string>();

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
    this.subscriptions.add(
      this.choiceTextChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.feedbackTextChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  feedbackChanged(): void {
    let show = true;
    if (!this.componentHasFeedback()) {
      show = false;
    }
    this.setShowSubmitButtonValue(show);
    this.componentChanged();
  }

  componentHasFeedback(): boolean {
    for (const choice of this.componentContent.choices) {
      if (choice.isCorrect || (choice.feedback != null && choice.feedback !== '')) {
        return true;
      }
    }
    return false;
  }

  addChoice(): void {
    const newChoice = {
      id: RandomKeyService.generate(),
      text: '',
      feedback: '',
      isCorrect: false
    };
    this.componentContent.choices.push(newChoice);
    this.componentChanged();
  }

  deleteChoice(choiceId: string): void {
    if (confirm($localize`Are you sure you want to delete this choice?`)) {
      const choices = this.componentContent.choices;
      for (let c = 0; c < choices.length; c++) {
        if (choices[c].id === choiceId) {
          choices.splice(c, 1);
          break;
        }
      }
      this.componentChanged();
    }
  }

  moveChoiceUp(choiceId: string): void {
    const choices = this.componentContent.choices;
    for (let c = 0; c < choices.length; c++) {
      const choice = choices[c];
      if (choice.id === choiceId) {
        if (c !== 0) {
          choices.splice(c, 1);
          choices.splice(c - 1, 0, choice);
        }
        break;
      }
    }
    this.componentChanged();
  }

  moveChoiceDown(choiceId: string): void {
    const choices = this.componentContent.choices;
    for (let c = 0; c < choices.length; c++) {
      const choice = choices[c];
      if (choice.id === choiceId) {
        if (c !== choices.length - 1) {
          choices.splice(c, 1);
          choices.splice(c + 1, 0, choice);
        }
        break;
      }
    }
    this.componentChanged();
  }

  chooseChoiceAsset(choice: any): void {
    const params = {
      isPopup: true,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: 'choice',
      targetObject: choice
    };
    this.openAssetChooser(params);
  }

  assetSelected({ nodeId, componentId, assetItem, target, targetObject }): void {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    if (target === 'choice') {
      targetObject.text = `<img src="${assetItem.fileName}"/>`;
      this.componentChanged();
    }
  }
}
