import { Component, Input, SimpleChanges } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'display-branch-path-steps',
  standalone: true,
  styleUrl: './display-branch-path-steps.component.scss',
  templateUrl: './display-branch-path-steps.component.html'
})
export class DisplayBranchPathStepsComponent {
  @Input() branchPathNodes: any[] = [];
  protected nodeIdToBackgroundColor: { [key: string]: string } = {};
  protected nodeIdToStepTitle: { [key: string]: string } = {};

  constructor(private projectService: TeacherProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.branchPathNodes) {
      this.getStepTitlesAndBackgroundColor();
    }
  }

  private getStepTitlesAndBackgroundColor(): void {
    for (const branchPathNode of this.branchPathNodes) {
      this.nodeIdToBackgroundColor[branchPathNode.nodeId] = this.projectService.getBackgroundColor(
        branchPathNode.nodeId
      );
      this.nodeIdToStepTitle[branchPathNode.nodeId] = this.projectService.getNodePositionAndTitle(
        branchPathNode.nodeId
      );
    }
  }
}
