import { Component } from '@angular/core';
import { AbstractExportComponent } from '../abstract-export.component';
import { StudentWorkDataExportStrategy } from '../strategies/StudentWorkDataExportStrategy';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectStepAndComponentCheckboxesComponent } from '../select-step-and-component-checkboxes/select-step-and-component-checkboxes.component';

@Component({
  imports: [
    MatButton,
    MatTooltip,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatCheckbox,
    FormsModule,
    SelectStepAndComponentCheckboxesComponent
  ],
  styleUrl: './export-student-work.component.scss',
  templateUrl: './export-student-work.component.html'
})
export class ExportStudentWorkComponent extends AbstractExportComponent {
  protected canViewStudentNames: boolean = false;
  protected exportType: string = 'latestStudentWork';

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

  ngOnInit(): void {
    super.ngOnInit();
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
  }

  protected export(): void {
    this.showDownloadingExportMessage();
    const strategy = new StudentWorkDataExportStrategy(this.exportType);
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }
}
