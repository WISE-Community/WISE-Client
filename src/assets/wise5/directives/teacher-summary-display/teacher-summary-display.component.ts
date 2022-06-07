import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { UtilService } from '../../services/utilService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplay } from '../summary-display/summary-display.component';
import { TeacherDataService } from '../../services/teacherDataService';

@Component({
  selector: 'teacher-summary-display',
  templateUrl: '../summary-display/summary-display.component.html',
  styleUrls: ['../summary-display/summary-display.component.scss']
})
export class TeacherSummaryDisplay extends SummaryDisplay {
  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService,
    private teacherDataService: TeacherDataService,
    protected utilService: UtilService
  ) {
    super(annotationService, configService, projectService, summaryService, utilService);
  }

  initializeDataService() {
    this.dataService = this.teacherDataService;
  }
}
