import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { generateRandomKey } from '../../../common/string/string';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { moveObjectDown, moveObjectUp } from '../../../common/array/array';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { Choice } from '../Choice';

@Component({
  imports: [
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatTooltipModule,
    EditComponentPrompt,
    TranslatableAssetChooserComponent,
    TranslatableInputComponent
  ],
  selector: 'multiple-choice-authoring',
  standalone: true,
  styleUrls: ['multiple-choice-authoring.component.scss'],
  templateUrl: 'multiple-choice-authoring.component.html'
})
export class MultipleChoiceAuthoring extends AbstractComponentAuthoring {
  allowedConnectedComponentTypes = ['MultipleChoice'];
  protected choiceTextChange: Subject<string> = new Subject<string>();
  protected feedbackTextChange: Subject<string> = new Subject<string>();

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
    this.componentContent.choices.push(new Choice(generateRandomKey(), '', false, ''));
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
