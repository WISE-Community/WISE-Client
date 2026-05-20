import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { EditComponentAdvancedButtonComponent } from '../edit-component-advanced-button/edit-component-advanced-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  imports: [
    EditComponentAdvancedButtonComponent,
    EditComponentComponent,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule
  ],
  template: `
    <div class="flex items-center">
      <h2 mat-dialog-title i18n>Edit: {{ componentIndex }}. {{ componentTypeLabel }}</h2>
      <span class="flex grow"></span>
      <edit-component-advanced-button
        [componentContent]="data.componentContent"
        [nodeId]="data.nodeId"
      />
    </div>
    <mat-divider />
    <mat-dialog-content>
      <edit-component
        class="block py-4"
        [componentContent]="data.componentContent"
        [nodeId]="data.nodeId"
      />
    </mat-dialog-content>
    <mat-divider />
    <mat-dialog-actions align="end">
      <button class="enable-in-translation" mat-button mat-dialog-close cdkFocusRegionstart i18n>
        Close
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .mat-divider {
      margin: 0;
    }
  `
})
export class EditComponentDialogComponent {
  protected componentIndex: number;
  protected componentTypeLabel: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: TeacherProjectService
  ) {
    this.componentIndex =
      this.projectService
        .getNode(this.data.nodeId)
        .getComponentIndex(this.data.componentContent.id) + 1;
    this.componentTypeLabel = inject(ComponentTypeService).getComponentTypeLabel(
      this.data.componentContent.type
    );
  }
}
