import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplayComponent } from '../summary-display/summary-display.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';
import { Observable } from 'rxjs';
import { Annotation } from '../../common/Annotation';
import { ComponentState } from '../../../../app/domain/componentState';

@Component({
  imports: [CommonModule, HighchartsChartModule, MatCardModule],
  selector: 'teacher-summary-display',
  standalone: true,
  styleUrl: '../summary-display/summary-display.component.scss',
  templateUrl: '../summary-display/summary-display.component.html'
})
export class TeacherSummaryDisplayComponent extends SummaryDisplayComponent {
  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  protected getLatestScores(): Observable<Annotation[]> {
    return this.getLatestStudentScores();
  }

  protected getLatestWork(): Observable<ComponentState[]> {
    return this.getLatestStudentWork();
  }

  protected renderResponsesOrScores(isRenderingResponses: boolean): void {
    if (this.isSourceSelf()) {
      this.displaySourceSelfMessageToTeacher();
    } else {
      isRenderingResponses ? this.renderClassResponses() : this.renderClassScores();
    }
  }

  private displaySourceSelfMessageToTeacher(): void {
    this.doRender = false;
    this.warningMessage = $localize`The student will see a graph of their individual data here.`;
    this.hasWarning = true;
  }
}
