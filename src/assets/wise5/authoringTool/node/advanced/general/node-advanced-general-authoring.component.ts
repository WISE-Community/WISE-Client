import { Component, inject, Input } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  selector: 'node-advanced-general-authoring',
  template: `
    <mat-checkbox color="primary" [(ngModel)]="node.showSaveButton" (change)="saveProject()" i18n>
      Show Save Button
    </mat-checkbox>
    <br />
    <mat-checkbox color="primary" [(ngModel)]="node.showSubmitButton" (change)="saveProject()" i18n>
      Show Submit Button
    </mat-checkbox>
  `
})
export class NodeAdvancedGeneralAuthoringComponent {
  @Input() node: any;

  private projectService = inject(TeacherProjectService);

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
