import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { EditComponentAdvancedButtonComponent } from '../edit-component-advanced-button/edit-component-advanced-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentTypeService } from '../../../services/componentTypeService';

@Component({
  imports: [
    EditComponentAdvancedButtonComponent,
    EditComponentComponent,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule
  ],
  template: `
    <div class="flex flex-row">
      <h2 mat-dialog-title i18n>Edit Activity ({{ componentTypeLabel }})</h2>
      <span class="flex grow"></span>
      <edit-component-advanced-button
        [componentContent]="data.componentContent"
        [nodeId]="data.nodeId"
      />
    </div>
    <mat-divider />
    <div mat-dialog-content>
      <edit-component [componentContent]="data.componentContent" [nodeId]="data.nodeId" />
    </div>
    <mat-divider />
    <mat-dialog-actions align="end">
      <button class="enable-in-translation" mat-button mat-dialog-close cdkFocusRegionstart i18n>
        Close
      </button>
    </mat-dialog-actions>
  `
})
export class EditComponentDialogComponent {
  protected componentTypeLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.componentTypeLabel = inject(ComponentTypeService).getComponentTypeLabel(
      this.data.componentContent.type
    );
  }
}
