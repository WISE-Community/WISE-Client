import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'manage-students',
  styleUrls: ['manage-students.component.scss'],
  templateUrl: 'manage-students.component.html'
})
export class ManageStudentsComponent {
  period: any;
  teams: Set<any> = new Set();
  students: Set<any> = new Set();

  subscriptions: Subscription = new Subscription();

  constructor(
    private ConfigService: ConfigService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.period = this.TeacherDataService.getCurrentPeriod();
    this.initializeTeams();
    this.initializeStudents();
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.period = currentPeriod;
        this.initializeTeams();
        this.initializeStudents();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initializeTeams() {
    this.teams.clear();
    const sortedWorkgroups = this.ConfigService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
    for (const workgroup of sortedWorkgroups) {
      if (workgroup.periodId === this.period.periodId) {
        workgroup.displayNames = this.ConfigService.getDisplayUsernamesByWorkgroupId(
          workgroup.workgroupId
        );
        this.teams.add(workgroup);
      }
    }
  }

  initializeStudents() {
    this.students.clear();
    for (const workgroup of this.ConfigService.getClassmateUserInfos()) {
      if (workgroup.periodId === this.period.periodId) {
        for (const user of workgroup.users) {
          this.students.add(user);
        }
      }
    }
  }
}
