import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditComponentTeacherReflectionsComponent } from '../../../../../app/authoring-tool/edit-component-teacher-reflections/edit-component-teacher-reflections.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [
    EditComponentPrompt,
    EditComponentTeacherReflectionsComponent,
    FormsModule,
    MatCheckboxModule
  ],
  styles: ['mat-checkbox { display: block; }'],
  templateUrl: 'discussion-authoring.component.html'
})
export class DiscussionAuthoring extends AbstractComponentAuthoring {}
