import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DisplayBranchPathStepsComponent } from '../display-branch-path-steps/display-branch-path-steps.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBranchPathsComponent } from '../create-branch-paths/create-branch-paths.component';

@Component({
  imports: [
    CommonModule,
    DisplayBranchPathStepsComponent,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  selector: 'edit-branch-paths',
  standalone: true,
  styleUrl: '../create-branch-paths/create-branch-paths.component.scss',
  templateUrl: './edit-branch-paths.component.html'
})
export class EditBranchPathsComponent extends CreateBranchPathsComponent {
  protected addPath(): void {
    this.pathCount++;
    this.updateNumPathFormControls();
    this.branchPaths.push({ new: true, nodesInBranchPath: [] });
  }
}
