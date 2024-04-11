import { Component } from '@angular/core';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'notebook-authoring',
  templateUrl: './notebook-authoring.component.html',
  styleUrls: ['./notebook-authoring.component.scss']
})
export class NotebookAuthoringComponent {
  protected notebookChanged: Subject<void> = new Subject<void>();
  protected project: any;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.project = this.projectService.project;

    if (this.project.notebook == null) {
      const projectTemplate = this.projectService.getNewProjectTemplate();
      this.project.notebook = projectTemplate.notebook;
    }

    if (this.project.teacherNotebook == null) {
      const projectTemplate = this.projectService.getNewProjectTemplate();
      projectTemplate.teacherNotebook.enabled = false;
      this.project.teacherNotebook = projectTemplate.teacherNotebook;
    }

    this.notebookChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });
  }

  protected contentChanged(): void {
    this.notebookChanged.next();
  }

  private save(): void {
    this.projectService.saveProject();
  }
}
