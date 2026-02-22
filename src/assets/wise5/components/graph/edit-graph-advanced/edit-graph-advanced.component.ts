import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentDefaultFeedback } from '../../../../../app/authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { EditGraphConnectedComponentsComponent } from '../edit-graph-connected-components/edit-graph-connected-components.component';
import { GraphContent } from '../GraphContent';

@Component({
  templateUrl: 'edit-graph-advanced.component.html',
  styleUrl: 'edit-graph-advanced.component.scss',
  imports: [
    TranslatableInputComponent,
    MatCheckbox,
    FormsModule,
    MatButton,
    MatTooltip,
    MatIcon,
    MatFormFieldModule,
    MatInput,
    EditComponentAddToNotebookButtonComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditGraphConnectedComponentsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent
  ]
})
export class EditGraphAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = [
    'Animation',
    'ConceptMap',
    'Draw',
    'Embedded',
    'Graph',
    'Label',
    'Table'
  ];
  componentContent: GraphContent;

  addXAxisPlotLine(): void {
    if (this.componentContent.xAxis.plotLines == null) {
      this.componentContent.xAxis.plotLines = [];
    }
    const plotLine = {
      color: 'gray',
      width: 1,
      value: null,
      label: {
        text: '',
        verticalAlign: 'bottom',
        textAlign: 'right',
        y: -10,
        style: {
          fontWeight: 'bold'
        }
      }
    };
    this.componentContent.xAxis.plotLines.push(plotLine);
    this.componentChanged();
  }

  deleteXAxisPlotLine(index: number): void {
    this.componentContent.xAxis.plotLines.splice(index, 1);
    this.componentChanged();
  }

  addYAxisPlotLine(): void {
    if (this.componentContent.yAxis.plotLines == null) {
      this.componentContent.yAxis.plotLines = [];
    }
    const plotLine = {
      color: 'gray',
      width: 1,
      value: null,
      label: {
        text: '',
        style: {
          fontWeight: 'bold'
        }
      }
    };
    this.componentContent.yAxis.plotLines.push(plotLine);
    this.componentChanged();
  }

  deleteYAxisPlotLine(index: number): void {
    this.componentContent.yAxis.plotLines.splice(index, 1);
    this.componentChanged();
  }
}
