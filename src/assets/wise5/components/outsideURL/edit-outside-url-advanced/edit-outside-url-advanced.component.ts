import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentAdvancedSharedModule } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced-shared.module';

@Component({
  imports: [EditComponentAdvancedSharedModule],
  template: `
    <mat-tab-group animationDuration="0ms">
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>settings</mat-icon>&nbsp;<span i18n>General</span>
        </ng-template>
        <div class="flex flex-col">
          <edit-component-width [componentContent]="componentContent" />
        </div>
      </mat-tab>
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>visibility</mat-icon>&nbsp;<span i18n>Visibility</span>
        </ng-template>
        <edit-component-constraints [componentContent]="component.content" />
      </mat-tab>
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>message</mat-icon>&nbsp;<span i18n>Rubric</span>
        </ng-template>
        <edit-component-rubric [componentContent]="component.content" />
      </mat-tab>
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>sell</mat-icon>&nbsp;<span i18n>Tags</span></ng-template
        >
        <edit-component-tags [componentContent]="component.content" />
      </mat-tab>
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>code</mat-icon>&nbsp;<span i18n>JSON</span></ng-template
        >
        <edit-component-json [component]="component" />
      </mat-tab>
    </mat-tab-group>
  `
})
export class EditOutsideUrlAdvancedComponent extends EditAdvancedComponentComponent {}
