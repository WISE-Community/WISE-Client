import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'display-branch-path-steps',
  styles: ['.branch-path-step { border-radius: 6px; padding: 8px; }'],
  templateUrl: './display-branch-path-steps.component.html'
})
export class DisplayBranchPathStepsComponent {
  private projectService = inject(TeacherProjectService);

  protected nodeIdToBackgroundColor: { [key: string]: string } = {};
  protected nodeIdToStepTitle: { [key: string]: string } = {};
  @Input() nodes: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodes) {
      this.setStepTitlesAndBackgroundColor();
    }
  }

  private setStepTitlesAndBackgroundColor(): void {
    for (const branchPathNode of this.nodes) {
      this.nodeIdToBackgroundColor[branchPathNode.nodeId] = this.projectService.getBackgroundColor(
        branchPathNode.nodeId
      );
      this.nodeIdToStepTitle[branchPathNode.nodeId] = this.projectService.getNodePositionAndTitle(
        branchPathNode.nodeId
      );
    }
  }
}
