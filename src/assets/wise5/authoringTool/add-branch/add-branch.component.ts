import { Component } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectStepComponent } from '../../../../app/authoring-tool/select-step/select-step.component';
import { SelectComponentComponent } from '../../../../app/authoring-tool/select-component/select-component.component';
import { BranchPathAuthoringComponent } from '../branch-path-authoring/branch-path-authoring.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SelectMergeStepComponent } from '../select-merge-step/select-merge-step.component';
import { CreateBranchService } from '../../services/createBranchService';
import { SelectPathCountComponent } from '../select-path-count/select-path-count.component';
import { SelectBranchCriteriaComponent } from '../select-branch-criteria/select-branch-criteria.component';
import { AbstractBranchAuthoringComponent } from '../abstract-branch-authoring/abstract-branch-authoring.component';

@Component({
  imports: [
    BranchPathAuthoringComponent,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    SelectBranchCriteriaComponent,
    SelectComponentComponent,
    SelectMergeStepComponent,
    SelectPathCountComponent,
    SelectStepComponent
  ],
  selector: 'add-branch',
  standalone: true,
  styleUrl: './add-branch.component.scss',
  templateUrl: './add-branch.component.html'
})
export class AddBranchComponent extends AbstractBranchAuthoringComponent {
  constructor(
    private createBranchService: CreateBranchService,
    protected fb: FormBuilder,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(fb, projectService, route, router);
  }

  protected async submit(): Promise<void> {
    await this.createBranchService.createBranch(this.getBranchParams());
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
