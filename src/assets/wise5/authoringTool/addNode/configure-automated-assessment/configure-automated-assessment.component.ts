import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { AbstractImportStepComponent } from '../abstract-import-step/abstract-import-step.component';

@Component({
  imports: [
    CdkTextareaAutosize,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    RouterModule
  ],
  selector: 'configure-automated-assessment',
  templateUrl: './configure-automated-assessment.component.html',
  styleUrls: ['./configure-automated-assessment.component.scss', '../../add-content.scss']
})
export class ConfigureAutomatedAssessmentComponent extends AbstractImportStepComponent {
  protected hasCustomization: boolean;
  protected node: any;

  ngOnInit(): void {
    super.ngOnInit();
    this.node = history.state.node;
    this.hasCustomization = this.node.components.some((component: any) => component.enableCRater);
  }
}
