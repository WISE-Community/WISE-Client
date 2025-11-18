import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@Component({
  imports: [ComponentHeaderComponent, MatCard, MatCardContent, ShowWorkStudentComponent],
  styleUrl: './show-my-work-student.component.scss',
  templateUrl: './show-my-work-student.component.html'
})
export class ShowMyWorkStudentComponent extends ComponentStudent {
  protected projectService = inject(ProjectService);
  showWorkComponentContent: any;
  showWorkComponentId: string;
  showWorkNodeId: string;
  studentWork: any;

  ngOnInit(): void {
    super.ngOnInit();
    this.showWorkComponentContent = this.projectService.getComponent(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
    this.showWorkComponentContent = this.projectService.injectAssetPaths(
      this.showWorkComponentContent
    );
    this.showWorkComponentId = this.componentContent.showWorkComponentId;
    this.showWorkNodeId = this.componentContent.showWorkNodeId;
    this.studentWork = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
  }
}
