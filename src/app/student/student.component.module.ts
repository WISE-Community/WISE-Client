import { NgModule } from '@angular/core';
import { AddToNotebookButton } from '../../assets/wise5/directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentHeader } from '../../assets/wise5/directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../assets/wise5/directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../assets/wise5/directives/componentAnnotations/component-annotations.component';
import { PromptComponent } from '../../assets/wise5/directives/prompt/prompt.component';
import { PossibleScoreComponent } from '../possible-score/possible-score.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';

@NgModule({
  declarations: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons
  ],
  imports: [
    ComponentStateInfoComponent,
    PossibleScoreComponent,
    PromptComponent,
    StudentTeacherCommonModule
  ],
  exports: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons
  ]
})
export class StudentComponentModule {}
