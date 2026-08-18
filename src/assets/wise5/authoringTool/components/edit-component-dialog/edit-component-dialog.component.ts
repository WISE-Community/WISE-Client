import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditComponentComponent } from '../edit-component/edit-component.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Component as WISEComponent } from '../../../common/Component';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { EditComponentTitleComponent } from '../edit-component-title/edit-component-title.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    EditComponentComponent,
    EditComponentTitleComponent,
    EditComponentAdvancedComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggle
  ],
  template: `
    <div class="flex items-center justify-between p-4">
      <h2 class="flex items-center gap-1 !m-0">
        <span i18n>Edit: {{ componentIndex }}. {{ componentTypeLabel }}</span>
        <mat-icon>{{ componentTypeIcon }}</mat-icon>
      </h2>
      <mat-slide-toggle color="primary" [(ngModel)]="advancedMode" i18n>Advanced</mat-slide-toggle>
    </div>
    <mat-divider class="!m-0" />
    <mat-dialog-content class="!max-h-none" [class.advanced-component-authoring]="advancedMode">
      @if (advancedMode) {
        <edit-component-advanced class="h-full" [component]="component" />
      } @else {
        <edit-component-title class="block pt-4" [componentContent]="data.componentContent" />
        <edit-component
          class="block h-full pb-4"
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
  protected component: WISEComponent;
  protected componentIndex: number;
  protected componentTypeIcon: string;
  protected componentTypeLabel: string;

  constructor(
    private componentInfoService: ComponentInfoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: TeacherProjectService
  ) {
    this.component = new WISEComponent(this.data.componentContent, this.data.nodeId);
    this.componentIndex =
      this.projectService
        .getNode(this.data.nodeId)
        .getComponentIndex(this.data.componentContent.id) + 1;
    this.componentTypeIcon = this.componentInfoService
      .getInfo(this.data.componentContent.type)
      .getIcon();
    this.componentTypeLabel = this.componentInfoService
      .getInfo(this.data.componentContent.type)
      .getLabel();
  }
}
