import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { AddStepTarget } from '../../../../../app/domain/addStepTarget';

@Component({
  selector: 'choose-automated-assessment',
  templateUrl: './choose-automated-assessment.component.html',
  styleUrls: ['./choose-automated-assessment.component.scss', '../../add-content.scss']
})
export class ChooseAutomatedAssessmentComponent {
  private importProjectId: number;
  protected node: any;
  protected target: AddStepTarget;
  private project: any;
  protected projectItems: any;

  constructor(
    private projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.target = history.state;
    this.importProjectId = this.projectService.getAutomatedAssessmentProjectId();
    this.showAutomatedAssessmentProject();
  }

  private showAutomatedAssessmentProject(): void {
    this.projectService.retrieveProjectById(this.importProjectId).then((projectJSON: any) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
      this.projectItems = Object.entries(nodeOrderOfProject.idToOrder)
        .map((entry: any) => {
          return { key: entry[0], node: entry[1].node, order: entry[1].order };
        })
        .sort((a: any, b: any) => {
          return a.order - b.order;
        });
    });
  }

  protected previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  protected next(): void {
    this.target.importProjectId = this.importProjectId;
    this.target.node = this.node;
    this.router.navigate(['..', 'configure'], {
      relativeTo: this.route,
      state: this.target
    });
  }
}
