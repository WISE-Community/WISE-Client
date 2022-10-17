import { NgModule } from '@angular/core';
import { ComponentStateInfoModule } from '../../assets/wise5/common/component-state-info/component-state-info.module';
import { AddToNotebookButton } from '../../assets/wise5/directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentHeader } from '../../assets/wise5/directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../assets/wise5/directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../assets/wise5/directives/componentAnnotations/component-annotations.component';
import { DynamicPromptComponent } from '../../assets/wise5/directives/dynamic-prompt/dynamic-prompt.component';
import { PromptComponent } from '../../assets/wise5/directives/prompt/prompt.component';
import { PossibleScoreComponent } from '../possible-score/possible-score.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';

@NgModule({
  declarations: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons,
    DynamicPromptComponent,
    PossibleScoreComponent,
    PromptComponent
  ],
  imports: [StudentTeacherCommonModule, ComponentStateInfoModule],
  exports: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons,
    DynamicPromptComponent,
    PossibleScoreComponent,
    PromptComponent
  ]
})
export class StudentComponentModule {}
