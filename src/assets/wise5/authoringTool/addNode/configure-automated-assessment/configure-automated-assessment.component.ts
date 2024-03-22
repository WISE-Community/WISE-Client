import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { AbstractImportStepComponent } from '../abstract-import-step/abstract-import-step.component';

@Component({
  selector: 'configure-automated-assessment',
  templateUrl: './configure-automated-assessment.component.html',
  styleUrls: ['./configure-automated-assessment.component.scss', '../../add-content.scss']
})
export class ConfigureAutomatedAssessmentComponent extends AbstractImportStepComponent {
  protected hasCustomization: boolean;
  private importFromProjectId: number;
  protected node: any;
  protected nodeIdToInsertInsideOrAfter: string;

  constructor(
    protected configService: ConfigService,
    protected copyNodesService: CopyNodesService,
    protected insertNodesService: InsertNodesService,
    protected projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(configService, copyNodesService, insertNodesService, projectService, route, router);
  }

  ngOnInit(): void {
    this.importFromProjectId = history.state.importFromProjectId;
    this.nodeIdToInsertInsideOrAfter = history.state.nodeIdToInsertInsideOrAfter;
    this.node = history.state.node;
    this.hasCustomization = this.node.components.some((component: any) => component.enableCRater);
  }

  protected submit(): void {
    super.submit([this.node], this.importFromProjectId, this.nodeIdToInsertInsideOrAfter);
  }
}
