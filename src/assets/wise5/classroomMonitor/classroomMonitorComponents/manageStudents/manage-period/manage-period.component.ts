import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'manage-period',
  styleUrls: ['manage-period.component.scss'],
  templateUrl: 'manage-period.component.html'
})
export class ManagePeriodComponent {
  @Input() period: any;

  students: Set<any> = new Set();
  subscriptions: Subscription = new Subscription();
  teams: Set<any> = new Set();

  constructor(private ConfigService: ConfigService) {}

  ngOnChanges() {
    this.initialize();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.ConfigService.configRetrieved$.subscribe(() => {
        this.initialize();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initialize() {
    this.initializeTeams();
    this.initializeStudents();
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
