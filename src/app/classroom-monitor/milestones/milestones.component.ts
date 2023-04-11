import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MilestoneDetailsDialogComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/milestones/milestone-details-dialog/milestone-details-dialog.component';
import { AchievementService } from '../../../assets/wise5/services/achievementService';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { MilestoneService } from '../../../assets/wise5/services/milestoneService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';

@Component({
  selector: 'milestones',
  styleUrls: ['milestones.component.scss'],
  templateUrl: 'milestones.component.html'
})
export class MilestonesComponent {
  milestones: any[];
  subscriptions: Subscription = new Subscription();

  constructor(
    private AchievementService: AchievementService,
    private AnnotationService: AnnotationService,
    private MilestoneService: MilestoneService,
    private dialog: MatDialog,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.loadProjectMilestones();
    this.subscriptions.add(
      this.AchievementService.newStudentAchievement$.subscribe((args: any) => {
        const studentAchievement = args.studentAchievement;
        this.AchievementService.addOrUpdateStudentAchievement(studentAchievement);
        this.updateMilestoneStatus(studentAchievement.achievementId);
      })
    );

    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(() => {
        for (const milestone of this.milestones) {
          this.updateMilestoneStatus(milestone.id);
        }
      })
    );

    this.subscriptions.add(
      this.AnnotationService.annotationReceived$.subscribe(({ annotation }) => {
        for (const milestone of this.milestones) {
          if (
            milestone.nodeId === annotation.nodeId &&
            milestone.componentId === annotation.componentId
          ) {
            this.updateMilestoneStatus(milestone.id);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadProjectMilestones() {
    this.milestones = this.MilestoneService.getProjectMilestones();
    for (let milestone of this.milestones) {
      milestone = this.MilestoneService.getProjectMilestoneStatus(milestone.id);
    }
  }

  updateMilestoneStatus(milestoneId) {
    let milestone = this.getProjectMilestoneById(milestoneId);
    milestone = this.MilestoneService.getProjectMilestoneStatus(milestoneId);
  }

  getProjectMilestoneById(milestoneId: string): any {
    for (const milestone of this.milestones) {
      if (milestone.id === milestoneId) {
        return milestone;
      }
    }
    return {};
  }

  showMilestoneDetails(milestone: any): void {
    this.dialog.open(MilestoneDetailsDialogComponent, {
      data: milestone,
      panelClass: 'dialog-lg'
    });
  }
}
