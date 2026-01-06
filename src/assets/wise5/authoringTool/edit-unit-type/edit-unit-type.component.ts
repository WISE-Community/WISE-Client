import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  imports: [FormsModule, MatRadioModule],
  selector: 'edit-unit-type',
  templateUrl: './edit-unit-type.component.html'
})
export class EditUnitTypeComponent {
  private projectService = inject(TeacherProjectService);

  @Input() metadata: any;

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
