import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BRANCH_CRITERIA, BranchCriteria } from '../../../../app/domain/branchCriteria';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FlexLayoutModule, FormsModule, MatFormFieldModule, MatSelectModule],
  selector: 'select-branch-criteria',
  standalone: true,
  styleUrl: './select-branch-criteria.component.scss',
  templateUrl: './select-branch-criteria.component.html'
})
export class SelectBranchCriteriaComponent {
  protected readonly BRANCH_CRITERIA: BranchCriteria[] = BRANCH_CRITERIA;

  @Input() criteria: string;
  @Output() criteriaChangedEvent: EventEmitter<string> = new EventEmitter<string>();
}
