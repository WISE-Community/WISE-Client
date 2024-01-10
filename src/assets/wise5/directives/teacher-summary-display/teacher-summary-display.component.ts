import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
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
    private teacherDataService: TeacherDataService
  ) {
    super(annotationService, configService, projectService, summaryService);
  }

  initializeDataService() {
    this.dataService = this.teacherDataService;
  }
}
