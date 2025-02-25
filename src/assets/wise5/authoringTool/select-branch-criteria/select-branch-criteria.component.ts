import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BRANCH_CRITERIA, BranchCriteria } from '../../../../app/domain/branchCriteria';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BranchCriteriaHelpComponent } from './branch-criteria-help/branch-criteria-help.component';

@Component({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTooltipModule
    ],
    selector: 'select-branch-criteria',
    styleUrl: './select-branch-criteria.component.scss',
    templateUrl: './select-branch-criteria.component.html'
})
export class SelectBranchCriteriaComponent {
  protected readonly BRANCH_CRITERIA: BranchCriteria[] = BRANCH_CRITERIA;

  @Input() criteria: string;
  @Output() criteriaChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(protected dialog: MatDialog) {}

  protected showCriteriaHelp(): void {
    this.dialog.open(BranchCriteriaHelpComponent, {
      panelClass: 'dialog-md'
    });
  }
}
