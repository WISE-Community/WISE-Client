import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MilestoneDetailsDialogComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details-dialog/milestone-details-dialog.component';
import { AchievementService } from '../../../assets/wise5/services/achievementService';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { MilestoneService } from '../../../assets/wise5/services/milestoneService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';
import { Milestone } from '../../domain/milestone';
import { Annotation } from '../../../assets/wise5/common/Annotation';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MilestoneReportDataComponent } from '../../teacher/milestone/milestone-report-data/milestone-report-data.component';
import { MilestoneReportGraphComponent } from '../../teacher/milestone/milestone-report-graph/milestone-report-graph.component';

@Component({
  imports: [MatCard, MatCardContent, MatProgressSpinner, NgClass, MatIcon],
  selector: 'milestones',
  styleUrl: 'milestones.component.scss',
  templateUrl: 'milestones.component.html'
})
export class MilestonesComponent {
  protected milestones: Milestone[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private achievementService: AchievementService,
    private annotationService: AnnotationService,
    private milestoneService: MilestoneService,
    private injector: Injector,
    private dialog: MatDialog,
    private dataService: TeacherDataService
  ) {
    if (!customElements.get('milestone-report-data')) {
      customElements.define(
        'milestone-report-data',
        createCustomElement(MilestoneReportDataComponent, { injector: this.injector })
      );
    }
    if (!customElements.get('milestone-report-graph')) {
      customElements.define(
        'milestone-report-graph',
        createCustomElement(MilestoneReportGraphComponent, { injector: this.injector })
      );
    }
  }

  ngOnInit() {
    this.loadProjectMilestones();
    this.subscribeToNewStudentAchievements();
    this.subscribeToPeriodChanges();
    this.subscribeToAnnotationChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadProjectMilestones(): void {
    this.milestones = this.milestoneService.getProjectMilestones();
    for (let milestone of this.milestones) {
      milestone = this.milestoneService.getProjectMilestoneStatus(milestone.id);
    }
  }

  private subscribeToNewStudentAchievements(): void {
    this.subscriptions.add(
      this.achievementService.newStudentAchievement$.subscribe((achievement: any) => {
        this.achievementService.addOrUpdateStudentAchievement(achievement);
        this.updateMilestoneStatus(achievement.achievementId);
      })
    );
  }

  private subscribeToPeriodChanges(): void {
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(() => {
        this.milestones.forEach((milestone) => this.updateMilestoneStatus(milestone.id));
      })
    );
  }

  private subscribeToAnnotationChanges(): void {
    this.subscriptions.add(
      this.annotationService.annotationReceived$.subscribe((annotation: Annotation) => {
        this.milestones
          .filter(
            (milestone) =>
              milestone.nodeId === annotation.nodeId &&
              milestone.componentId === annotation.componentId
          )
          .forEach((milestone) => this.updateMilestoneStatus(milestone.id));
      })
    );
  }

  private updateMilestoneStatus(milestoneId: string): void {
    let milestone = this.milestones.find((milestone) => milestone.id === milestoneId);
    milestone = this.milestoneService.getProjectMilestoneStatus(milestoneId);
  }

  protected showMilestoneDetails(milestone: any): void {
    this.dialog.open(MilestoneDetailsDialogComponent, {
      data: milestone,
      panelClass: 'dialog-lg'
    });
  }
}
