import { Component, ViewEncapsulation } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { StepToolsComponent } from '../../../common/stepTools/step-tools.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { TeacherDataService } from '../../../services/teacherDataService';
import { GradingNodeService } from '../../../services/gradingNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NodeIconComponent
  ],
  selector: 'grading-step-tools',
  standalone: true,
  templateUrl: '../../../common/stepTools/step-tools.component.html',
  styleUrl: '../../../common/stepTools/step-tools.component.scss'
})
export class GradingStepToolsComponent extends StepToolsComponent {
  constructor(
    protected dataService: TeacherDataService,
    protected dir: Directionality,
    protected nodeService: GradingNodeService,
    protected projectService: TeacherProjectService
  ) {
    super(dataService, dir, nodeService, projectService);
  }

  protected calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds = this.nodeIds.filter((nodeId) => {
      return this.isGroupNode(nodeId) || this.projectService.nodeHasWork(nodeId);
    });
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected getNextNodeId(): Promise<any> {
    return Promise.resolve(this.nodeService.getNextNodeId(this.nodeId));
  }
}
