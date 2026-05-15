import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Component as WISEComponent } from '../../../common/Component';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';

@Component({
  imports: [
    EditComponentComponent,
    EditComponentAdvancedComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatSlideToggle
  ],
  template: `
    <div class="flex flex-row items-center">
      <h2 mat-dialog-title i18n>Edit Activity ({{ componentTypeLabel }})</h2>
      <mat-slide-toggle [(ngModel)]="advancedMode" i18n>Advanced mode</mat-slide-toggle>
    </div>
    <mat-divider />
    <div mat-dialog-content>
      @if (advancedMode) {
        <edit-component-advanced [component]="component" />
      } @else {
        <edit-component [componentContent]="data.componentContent" [nodeId]="data.nodeId" />
      }
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
  protected advancedMode = false;
  protected component: WISEComponent;
  protected componentTypeLabel: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.component = new WISEComponent(this.data.componentContent, this.data.nodeId);
    this.componentTypeLabel = this.componentTypeService.getComponentTypeLabel(
      this.data.componentContent.type
    );
  }
}
