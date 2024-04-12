import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-rubric',
  templateUrl: 'edit-component-rubric.component.html',
  styleUrls: ['edit-component-rubric.component.scss']
})
export class EditComponentRubricComponent {
  @Input() componentContent: any;
  protected showRubricAuthoring: boolean = false;

  constructor(private projectService: TeacherProjectService) {}

  protected rubricChanged(): void {
    this.projectService.componentChanged();
  }
}
