import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  selector: 'select-step',
  template: `<mat-form-field>
    <mat-label i18n>Step</mat-label>
    <mat-select [(ngModel)]="nodeId" (ngModelChange)="stepChangedEvent.emit($event)">
      @for (nodeId of nodeIds; track nodeId) {
        <mat-option [value]="nodeId">{{ nodeToPositionAndTitle.get(nodeId) }}</mat-option>
      }
    </mat-select>
  </mat-form-field>`
})
export class SelectStepComponent {
  @Input() nodeId: string;
  protected nodeIds: string[] = [];
  protected nodeToPositionAndTitle: Map<string, string> = new Map<string, string>();
  @Output() stepChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getStepNodeIds();
    this.nodeIds.forEach((nodeId) =>
      this.nodeToPositionAndTitle.set(nodeId, this.projectService.getNodePositionAndTitle(nodeId))
    );
  }
}
