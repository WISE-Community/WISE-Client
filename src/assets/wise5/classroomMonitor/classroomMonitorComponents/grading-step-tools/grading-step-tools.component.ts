import { Component, inject, ViewEncapsulation } from '@angular/core';
import { StepToolsComponent } from '../../../common/stepTools/step-tools.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { GradingNodeService } from '../../../services/gradingNodeService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
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
  styleUrl: '../../../common/stepTools/step-tools.component.scss',
  templateUrl: '../../../common/stepTools/step-tools.component.html'
})
export class GradingStepToolsComponent extends StepToolsComponent {
  protected override nodeService = inject(GradingNodeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    super.ngOnInit();
    this.dataService.setCurrentNodeByNodeId(this.getNodeId());
  }

  protected getNodeId(): string {
    return this.route.firstChild.snapshot.params['nodeId'];
  }

  protected nodeChanged(): void {
    this.navigateToNode(this.nodeId);
  }

  protected goToPrevNode(): void {
    super.goToPrevNode();
    this.navigateToNode(this.nodeId);
  }

  protected goToNextNode(): Promise<void> {
    return super.goToNextNode().then(() => {
      this.navigateToNode(this.nodeId);
    });
  }

  private navigateToNode(nodeId: string): void {
    this.router
      .navigate(['node', nodeId], {
        relativeTo: this.route
      })
      .then(() => {
        this.dataService.setCurrentNodeByNodeId(nodeId);
        this.updateModel();
      });
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
