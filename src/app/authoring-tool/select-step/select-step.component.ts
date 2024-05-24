import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'select-step',
  templateUrl: './select-step.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule]
})
export class SelectStepComponent {
  @Input() nodeId: string;
  protected nodeIds: string[] = [];
  protected nodeToPositionAndTitle: Map<string, string> = new Map<string, string>();
  @Output() stepChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getStepNodeIds();
    for (const nodeId of this.nodeIds) {
      this.nodeToPositionAndTitle.set(nodeId, this.projectService.getNodePositionAndTitle(nodeId));
    }
  }
}
