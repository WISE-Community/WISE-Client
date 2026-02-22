import { Component } from '@angular/core';
import { SummaryDisplayComponent } from '../summary-display/summary-display.component';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { Observable, Subscription } from 'rxjs';
import { Annotation } from '../../common/Annotation';
import { ComponentState } from '../../../../app/domain/componentState';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  imports: [CommonModule, HighchartsChartModule],
  selector: 'teacher-summary-display',
  styleUrl: '../summary-display/summary-display.component.scss',
  templateUrl: '../summary-display/summary-display.component.html'
})
export class TeacherSummaryDisplayComponent extends SummaryDisplayComponent {
  private subscriptions = new Subscription();

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      (this.projectService as TeacherProjectService).projectSaved$.subscribe(() =>
        this.renderDisplay()
      )
    );
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
