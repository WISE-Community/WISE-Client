import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatableRichTextEditorComponent } from '../../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    TranslatableRichTextEditorComponent
  ],
  selector: 'edit-component-rubric',
  styles: [
    'label { margin-right: 10px; } div { margin-bottom: 10px; } .mat-icon { margin: 0px; } '
  ],
  templateUrl: 'edit-component-rubric.component.html'
})
export class EditComponentRubricComponent {
  @Input() componentContent: any;
  protected showRubricAuthoring: boolean;

  constructor(private projectService: TeacherProjectService) {}

  protected save(): void {
    this.projectService.componentChanged();
  }
}
