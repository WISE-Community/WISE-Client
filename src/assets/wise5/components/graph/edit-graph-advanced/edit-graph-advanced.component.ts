import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

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

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected TeacherProjectService: TeacherProjectService
  ) {
    super(NodeService, NotebookService, TeacherProjectService);
  }

  addXAxisPlotLine(): void {
    if (this.authoringComponentContent.xAxis.plotLines == null) {
      this.authoringComponentContent.xAxis.plotLines = [];
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
    this.authoringComponentContent.xAxis.plotLines.push(plotLine);
    this.componentChanged();
  }

  deleteXAxisPlotLine(index: number): void {
    this.authoringComponentContent.xAxis.plotLines.splice(index, 1);
    this.componentChanged();
  }

  addYAxisPlotLine(): void {
    if (this.authoringComponentContent.yAxis.plotLines == null) {
      this.authoringComponentContent.yAxis.plotLines = [];
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
    this.authoringComponentContent.yAxis.plotLines.push(plotLine);
    this.componentChanged();
  }

  deleteYAxisPlotLine(index: number): void {
    this.authoringComponentContent.yAxis.plotLines.splice(index, 1);
    this.componentChanged();
  }
}
