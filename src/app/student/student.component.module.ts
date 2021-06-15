import { NgModule } from '@angular/core';
import { AddToNotebookButton } from '../../assets/wise5/directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentHeader } from '../../assets/wise5/directives/component-header/component-header.component';
import { ComponentSaveSubmitButtons } from '../../assets/wise5/directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../assets/wise5/directives/componentAnnotations/component-annotations.component';
import { AngularJSModule } from '../common-hybrid-angular.module';
import { PossibleScoreComponent } from '../possible-score/possible-score.component';

@NgModule({
  declarations: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons,
    PossibleScoreComponent
  ],
  imports: [AngularJSModule],
  exports: [
    AddToNotebookButton,
    ComponentAnnotationsComponent,
    ComponentHeader,
    ComponentSaveSubmitButtons,
    PossibleScoreComponent
  ]
})
export class StudentComponentModule {}
