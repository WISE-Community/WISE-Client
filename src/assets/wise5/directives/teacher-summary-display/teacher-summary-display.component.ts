import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplayComponent } from '../summary-display/summary-display.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';
import { Observable, Subscription } from 'rxjs';
import { Annotation } from '../../common/Annotation';
import { ComponentState } from '../../../../app/domain/componentState';
import { CRaterService } from '../../services/cRaterService';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  imports: [CommonModule, HighchartsChartModule, MatCardModule],
  selector: 'teacher-summary-display',
  styleUrl: '../summary-display/summary-display.component.scss',
  templateUrl: '../summary-display/summary-display.component.html'
})
export class TeacherSummaryDisplayComponent extends SummaryDisplayComponent {
  private subscriptions = new Subscription();

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(
      annotationService,
      configService,
      cRaterService,
      dataService,
      projectService,
      summaryService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(this.projectService.projectSaved$.subscribe(() => this.renderDisplay()));
    this.subscriptions.add(
      this.annotationService.annotationReceived$.subscribe(() => this.renderDisplay())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected getLatestScores(): Observable<Annotation[]> {
    return this.getLatestStudentScores();
  }

  protected getLatestWork(): Observable<ComponentState[]> {
    return this.getLatestStudentWork();
  }

  protected renderSelfDisplay(): void {
    this.displaySourceSelfMessageToTeacher();
  }

  private displaySourceSelfMessageToTeacher(): void {
    this.doRender = false;
    this.warningMessage = $localize`The student will see a graph of their individual data here.`;
    this.hasWarning = true;
  }
}
