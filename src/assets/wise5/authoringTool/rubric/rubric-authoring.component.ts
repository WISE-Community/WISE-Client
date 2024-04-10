import { TeacherProjectService } from '../../services/teacherProjectService';
import { Component } from '@angular/core';

@Component({
  selector: 'rubric-authoring',
  templateUrl: 'rubric-authoring.component.html',
  styleUrls: ['./rubric-authoring.component.scss']
})
export class RubricAuthoringComponent {
  protected project: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.project = this.projectService.getProject();
  }

  protected rubricChanged(): void {
    this.projectService.saveProject();
  }
}
