import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BRANCH_CRITERIA, BranchCriteria } from '../../../../app/domain/branchCriteria';
import { BranchCriteriaHelpComponent } from './branch-criteria-help/branch-criteria-help.component';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  selector: 'select-branch-criteria',
  styles: ['.select-criteria { min-width: 320px; }'],
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
