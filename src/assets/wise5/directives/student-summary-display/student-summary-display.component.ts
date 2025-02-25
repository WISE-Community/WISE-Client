import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplay } from '../summary-display/summary-display.component';
import { StudentDataService } from '../../services/studentDataService';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
    imports: [CommonModule, HighchartsChartModule, MatCardModule],
    selector: 'student-summary-display',
    styleUrl: '../summary-display/summary-display.component.scss',
    templateUrl: '../summary-display/summary-display.component.html'
})
export class StudentSummaryDisplay extends SummaryDisplay {
  private studentWorkSavedToServerSubscription: Subscription;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: StudentDataService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeChangeListeners();
  }

  ngOnDestroy(): void {
    this.studentWorkSavedToServerSubscription.unsubscribe();
  }

  private initializeChangeListeners(): void {
    this.studentWorkSavedToServerSubscription =
      this.dataService.studentWorkSavedToServer$.subscribe((componentState) => {
        if (
          this.doRender &&
          componentState.nodeId === this.nodeId &&
          componentState.componentId === this.componentId
        ) {
          this.renderDisplay();
        }
      });
  }
}
