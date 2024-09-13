import { Component, Input, SimpleChanges } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CommonModule, FlexLayoutModule],
  selector: 'display-branch-path-steps',
  standalone: true,
  styleUrl: './display-branch-path-steps.component.scss',
  templateUrl: './display-branch-path-steps.component.html'
})
export class DisplayBranchPathStepsComponent {
  protected nodeIdToBackgroundColor: { [key: string]: string } = {};
  protected nodeIdToStepTitle: { [key: string]: string } = {};
  @Input() nodes: any[] = [];

  constructor(private projectService: TeacherProjectService) {}

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
