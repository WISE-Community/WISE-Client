import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { generateRandomKey } from '../../../common/string/string';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { moveObjectDown, moveObjectUp } from '../../../common/array/array';

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
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
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

  protected feedbackChanged(): void {
    let show = true;
    if (!this.componentHasFeedback()) {
      show = false;
    }
    this.setShowSubmitButtonValue(show);
    this.componentChanged();
  }

  private componentHasFeedback(): boolean {
    for (const choice of this.componentContent.choices) {
      if (choice.isCorrect || (choice.feedback != null && choice.feedback !== '')) {
        return true;
      }
    }
    return false;
  }

  protected addChoice(): void {
    const newChoice = {
      id: generateRandomKey(),
      text: '',
      feedback: '',
      isCorrect: false
    };
    this.componentContent.choices.push(newChoice);
    this.componentChanged();
  }

  protected deleteChoice(choice: any): void {
    if (confirm($localize`Are you sure you want to delete this choice?`)) {
      this.componentContent.choices.splice(this.findChoiceIndex(choice), 1);
      this.componentChanged();
    }
  }

  protected moveChoiceUp(choice: any): void {
    moveObjectUp(this.componentContent.choices, this.findChoiceIndex(choice));
    this.componentChanged();
  }

  protected moveChoiceDown(choice: any): void {
    moveObjectDown(this.componentContent.choices, this.findChoiceIndex(choice));
    this.componentChanged();
  }

  private findChoiceIndex(searchChoice: any): number {
    return this.componentContent.choices.findIndex((choice) => choice === searchChoice);
  }

  protected processSelectedAsset(value: string): string {
    return `<img src="${value}" alt="${value}" />`;
  }
}
