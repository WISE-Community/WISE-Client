import { Component, ViewEncapsulation } from '@angular/core';
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
  protected calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds = this.nodeIds.filter((nodeId) => {
      return this.isGroupNode(nodeId) || this.projectService.nodeHasWork(nodeId);
    });
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected getPrevNodeId(): string {
    return this.nodeService.getPrevNodeIdWithWork(this.nodeId);
  }

  protected getNextNodeId(): Promise<any> {
    return Promise.resolve(this.nodeService.getNextNodeIdWithWork(this.nodeId));
  }

  protected goToPrevNode(): void {
    this.nodeService.goToPrevNodeWithWork();
    this.nodeId = this.dataService.getCurrentNodeId();
  }

  protected goToNextNode(): void {
    this.nodeService.goToNextNodeWithWork().then((nodeId: string) => {
      this.nodeId = nodeId;
    });
  }
}
