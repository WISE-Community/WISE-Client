import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { generateRandomKey } from '../../../common/string/string';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'multiple-choice-authoring',
  templateUrl: 'multiple-choice-authoring.component.html',
  styleUrls: ['multiple-choice-authoring.component.scss']
})
export class MultipleChoiceAuthoring extends AbstractComponentAuthoring {
  allowedConnectedComponentTypes = ['MultipleChoice'];
  choiceTextChange: Subject<string> = new Subject<string>();
  feedbackTextChange: Subject<string> = new Subject<string>();

  constructor(
    protected ConfigService: ConfigService,
    private dialog: MatDialog,
    protected NodeService: TeacherNodeService,
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
      id: generateRandomKey(),
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
    new AssetChooser(this.dialog, this.nodeId, this.componentId)
      .open('choice', choice)
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((data: any) => {
        return this.assetSelected(data);
      });
  }

  assetSelected({ nodeId, componentId, assetItem, target, targetObject }): void {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    if (target === 'choice') {
      targetObject.text = `<img src="${assetItem.fileName}"/>`;
      this.componentChanged();
    }
  }
}
