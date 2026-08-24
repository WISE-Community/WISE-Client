import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { EditGraphConnectedComponentsComponent } from '../edit-graph-connected-components/edit-graph-connected-components.component';
import { GraphContent } from '../GraphContent';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [
    EditComponentAdvancedSharedModule,
    EditGraphConnectedComponentsComponent,
    MatButton,
    MatFormFieldModule,
    MatInput,
    MatTooltip,
    TranslatableInputComponent
  ],
  styleUrl: 'edit-graph-advanced.component.scss',
  templateUrl: 'edit-graph-advanced.component.html'
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
