import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'branch-criteria-help',
    imports: [MatButtonModule, MatDialogModule, MatDividerModule],
    templateUrl: './branch-criteria-help.component.html'
})
export class BranchCriteriaHelpComponent {}
