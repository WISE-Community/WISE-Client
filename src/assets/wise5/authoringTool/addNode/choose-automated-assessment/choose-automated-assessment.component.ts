import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { HttpClient } from '@angular/common/http';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigureStructureComponent } from '../../structure/configure-structure.component';

@Component({
  selector: 'choose-automated-assessment',
  templateUrl: './choose-automated-assessment.component.html',
  styleUrls: ['./choose-automated-assessment.component.scss']
})
export class ChooseAutomatedAssessmentComponent extends ConfigureStructureComponent {
  private automatedAssessmentProjectId: number;
  protected node: any;
  private project: any;
  protected projectItems: any;

  constructor(
    http: HttpClient,
    private projectService: TeacherProjectService,
    protected upgrade: UpgradeModule
  ) {
    super(http, upgrade);
  }

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.automatedAssessmentProjectId = this.projectService.getAutomatedAssessmentProjectId();
    this.showAutomatedAssessmentProject();
  }

  private showAutomatedAssessmentProject(): void {
    this.projectService
      .retrieveProjectById(this.automatedAssessmentProjectId)
      .then((projectJSON: any) => {
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

  protected back(): void {
    this.$state.go('root.at.project.add-node.choose-template');
  }

  protected next(): void {
    this.$state.go('root.at.project.add-node.automated-assessment.configure', {
      importFromProjectId: this.automatedAssessmentProjectId,
      node: this.node
    });
  }
}
