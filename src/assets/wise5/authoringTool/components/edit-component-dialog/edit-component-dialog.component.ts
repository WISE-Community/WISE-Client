import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Component as WISEComponent } from '../../../common/Component';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    EditComponentComponent,
    EditComponentAdvancedComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatSlideToggle,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="flex items-center justify-between pe-4">
      <h2 mat-dialog-title i18n>Edit: {{ componentIndex }}. {{ componentTypeLabel }}</h2>
      <mat-slide-toggle color="primary" [(ngModel)]="advancedMode" i18n>Advanced</mat-slide-toggle>
    </div>
    <mat-divider class="!m-0" />
    <mat-dialog-content class="!max-h-none" style="padding-top: 28px;" [class.advanced-component-authoring]="advancedMode">
      @if (advancedMode) {
        <edit-component-advanced class="h-full" [component]="component" />
      } @else {
        <mat-form-field class="w-full">
          <mat-label i18n>Header</mat-label>
          <input
            matInput
            [(ngModel)]="data.componentContent.header"
            (ngModelChange)="headerChanged()"
          />
        </mat-form-field>
        <edit-component
          class="block h-full py-4"
          [componentContent]="data.componentContent"
          [nodeId]="data.nodeId"
        />
      }
    </mat-dialog-content>
    <mat-divider class="!m-0" />
    <mat-dialog-actions align="end">
      <button class="enable-in-translation" mat-button mat-dialog-close cdkFocusRegionstart i18n>
        Close
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    @reference "tailwindcss";
    .advanced-component-authoring {
      @apply !p-0;
    }
    .translatable-rich-text-full-height {
      @apply h-full block;
      .mat-tab-group,
      .mat-mdc-tab-group,
      .mat-mdc-tab-body-wrapper,
      .mat-mdc-tab-body-content {
        @apply h-full;
      }
      .translatable-rich-text-editor {
        @apply h-full flex flex-col;
        wise-authoring-tinymce-editor {
          @apply flex-1;
        }
      }
      editor {
        @apply !h-full;
      }
    }
  `
})
export class EditComponentDialogComponent {
  protected advancedMode = false;

  headerChanged(): void {
    this.projectService.saveProject();
  }
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
