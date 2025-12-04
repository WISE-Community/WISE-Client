import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [MatButtonModule, MatDialogModule, MatDividerModule],
  selector: 'branch-criteria-help',
  templateUrl: './branch-criteria-help.component.html'
})
export class BranchCriteriaHelpComponent {}
