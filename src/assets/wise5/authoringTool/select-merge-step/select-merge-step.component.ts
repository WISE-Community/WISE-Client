import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'select-merge-step',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select-merge-step.component.html'
})
export class SelectMergeStepComponent {
  @Input() branchStepId: string;
  protected mergeStepId: string = '';
  protected nextStepId: string = '';
  @Output() selectMergeStepEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    const branchStepParentId = this.projectService.getParentGroupId(this.branchStepId);
    const nextStepId = this.projectService.getNextNodeId(this.branchStepId);
    const nextStepParentId = this.projectService.getParentGroupId(nextStepId);
    if (branchStepParentId === nextStepParentId) {
      this.nextStepId = nextStepId;
      this.mergeStepId = this.nextStepId;
    }
    this.selectMergeStepEvent.emit(this.mergeStepId);
  }
}
