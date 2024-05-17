import { NgModule } from '@angular/core';
import { AddToNotebookButtonComponent } from '../../assets/wise5/directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentHeaderComponent } from '../../assets/wise5/directives/component-header/component-header.component';
import { ComponentSaveSubmitButtonsComponent } from '../../assets/wise5/directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../assets/wise5/directives/componentAnnotations/component-annotations.component';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';

@NgModule({
  imports: [
    AddToNotebookButtonComponent,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    ComponentSaveSubmitButtonsComponent,
    ComponentStateInfoComponent
  ],
  exports: [
    AddToNotebookButtonComponent,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    ComponentSaveSubmitButtonsComponent
  ]
})
export class StudentComponentModule {}
