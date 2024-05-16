import { NgModule } from '@angular/core';
import { AddToNotebookButtonComponent } from '../../assets/wise5/directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentHeaderComponent } from '../../assets/wise5/directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../assets/wise5/directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../assets/wise5/directives/componentAnnotations/component-annotations.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';

@NgModule({
  declarations: [ComponentAnnotationsComponent, ComponentSaveSubmitButtons],
  imports: [
    AddToNotebookButtonComponent,
    ComponentHeaderComponent,
    ComponentStateInfoComponent,
    StudentTeacherCommonModule
  ],
  exports: [
    AddToNotebookButtonComponent,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    ComponentSaveSubmitButtons
  ]
})
export class StudentComponentModule {}
