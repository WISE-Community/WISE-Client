import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Component as WISEComponent } from '../../../common/Component';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';

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
    <div class="flex items-center">
      <h2 mat-dialog-title i18n>Edit: {{ componentIndex }}. {{ componentTypeLabel }}</h2>
      <mat-slide-toggle [(ngModel)]="advancedMode" i18n>Advanced mode</mat-slide-toggle>
    </div>
    <mat-divider />
    <mat-dialog-content>
      @if (advancedMode) {
        <edit-component-advanced [component]="component" />
      } @else {
        <edit-component
          class="block py-4"
          [componentContent]="data.componentContent"
          [nodeId]="data.nodeId"
        />
      }
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
  protected advancedMode = false;
  protected component: WISEComponent;
  protected componentIndex: number;
  protected componentTypeLabel: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: TeacherProjectService
  ) {
    this.component = new WISEComponent(this.data.componentContent, this.data.nodeId);
    this.componentIndex =
      this.projectService
        .getNode(this.data.nodeId)
        .getComponentIndex(this.data.componentContent.id) + 1;
    this.componentTypeLabel = this.componentTypeService.getComponentTypeLabel(
      this.data.componentContent.type
    );
  }
}
