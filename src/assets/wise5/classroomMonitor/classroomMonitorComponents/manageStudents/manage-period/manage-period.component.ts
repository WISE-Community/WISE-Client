import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { GetWorkgroupService } from '../../../../../../app/services/getWorkgroupService';

@Component({
  selector: 'manage-period',
  styleUrls: ['manage-period.component.scss'],
  templateUrl: 'manage-period.component.html'
})
export class ManagePeriodComponent {
  @Input() period: any;

  students: Set<any> = new Set();
  subscriptions: Subscription = new Subscription();
  teams: Map<number, any> = new Map();

  constructor(
    private ConfigService: ConfigService,
    private GetWorkgroupService: GetWorkgroupService
  ) {}

  ngOnChanges() {
    this.init();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.ConfigService.configRetrieved$.subscribe(() => {
        this.init();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  init() {
    this.initTeams();
    this.initStudents();
  }

  initTeams() {
    this.teams.clear();
    for (const workgroup of this.getWorkgroupsSortedById()) {
      if (workgroup.periodId === this.period.periodId) {
        workgroup.displayNames = this.ConfigService.getDisplayUsernamesByWorkgroupId(
          workgroup.workgroupId
        );
        this.teams.set(workgroup.workgroupId, workgroup);
      }
    }
    this.initEmptyTeams();
  }

  private getWorkgroupsSortedById() {
    return this.ConfigService.getClassmateUserInfos().sort((a, b) => {
      return a.workgroupId - b.workgroupId;
    });
  }

  private initEmptyTeams() {
    this.GetWorkgroupService.getAllWorkgroupsInPeriod(this.period.periodId).subscribe(
      (workgroups: any[]) => {
        for (const workgroup of workgroups) {
          if (!this.teams.has(workgroup.id)) {
            workgroup.workgroupId = workgroup.id;
            workgroup.users = [];
            this.teams.set(workgroup.id, workgroup);
          }
        }
      }
    );
  }

  initStudents() {
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
