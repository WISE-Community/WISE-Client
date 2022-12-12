import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { GraphContent } from '../GraphContent';

@Component({
  template: 'edit-graph-advanced',
  templateUrl: 'edit-graph-advanced.component.html',
  styleUrls: ['edit-graph-advanced.component.scss']
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

  constructor(
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, teacherProjectService);
  }

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
