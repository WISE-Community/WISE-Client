import { Component } from '@angular/core';
import { AbstractExportComponent } from '../abstract-export.component';
import { OneWorkgroupPerRowDataExportStrategy } from '../strategies/OneWorkgroupPerRowDataExportStrategy';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'export-gradebook',
  templateUrl: './export-gradebook.component.html',
  styleUrls: ['./export-gradebook.component.scss']
})
export class ExportGradebookComponent extends AbstractExportComponent {
  includeBranchPathTaken: boolean;
  includeBranchPathTakenNodeId: boolean;
  includeBranchPathTakenStepTitle: boolean;
  includeComments: boolean;
  includeCommentTimestamps: boolean;
  includeScores: boolean;
  includeScoreTimestamps: boolean;
  includeStudentNames: boolean;
  includeStudentWork: boolean;
  includeStudentWorkIds: boolean;
  includeStudentWorkTimestamps: boolean;

  constructor(
    public annotationService: AnnotationService,
    public componentServiceLookupService: ComponentServiceLookupService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    public dataService: TeacherDataService,
    protected dialog: MatDialog,
    public projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(
      annotationService,
      configService,
      dataExportService,
      dataService,
      dialog,
      projectService,
      route,
      router
    );
  }

  protected export(): void {
    this.showDownloadingExportMessage();
    const strategy = new OneWorkgroupPerRowDataExportStrategy();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }
}
