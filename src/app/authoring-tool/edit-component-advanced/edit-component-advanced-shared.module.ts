import { NgModule } from '@angular/core';
import { EditComponentDefaultFeedback } from '../edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentMaxScoreComponent } from '../edit-component-max-score/edit-component-max-score.component';
import { EditComponentMaxSubmitComponent } from '../edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentRubricComponent } from '../edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../edit-component-width/edit-component-width.component';
import { EditComponentConstraintsComponent } from '../edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule
  ],
  exports: [
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class EditComponentAdvancedSharedModule {}
