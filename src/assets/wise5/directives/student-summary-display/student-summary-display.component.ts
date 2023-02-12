import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplay } from '../summary-display/summary-display.component';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'student-summary-display',
  templateUrl: '../summary-display/summary-display.component.html',
  styleUrls: ['../summary-display/summary-display.component.scss']
})
export class StudentSummaryDisplay extends SummaryDisplay {
  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected projectService: ProjectService,
    private studentDataService: StudentDataService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, projectService, summaryService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeChangeListeners();
  }

  ngOnDestroy() {
    this.studentWorkSavedToServerSubscription.unsubscribe();
  }

  initializeDataService() {
    this.dataService = this.studentDataService;
  }

  initializeChangeListeners() {
    this.studentWorkSavedToServerSubscription = this.studentDataService.studentWorkSavedToServer$.subscribe(
      (componentState) => {
        if (
          this.doRender &&
          componentState.nodeId === this.nodeId &&
          componentState.componentId === this.componentId
        ) {
          this.renderDisplay();
        }
      }
    );
  }
}
