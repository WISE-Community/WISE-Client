import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
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
  emptyTeams: Map<number, any> = new Map();
  teams: Map<number, any> = new Map();

  constructor(
    private ConfigService: ConfigService,
    private GetWorkgroupService: GetWorkgroupService,
    private WorkgroupService: WorkgroupService
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
    this.teams = this.WorkgroupService.getWorkgroupsInPeriod(this.period.periodId);
    this.initEmptyTeams();
  }

  private initEmptyTeams() {
    this.emptyTeams.clear();
    this.GetWorkgroupService.getAllWorkgroupsInPeriod(this.period.periodId).subscribe(
      (workgroups: any[]) => {
        for (const workgroup of workgroups) {
          if (!this.teams.has(workgroup.id)) {
            workgroup.workgroupId = workgroup.id;
            workgroup.users = [];
            this.emptyTeams.set(workgroup.id, workgroup);
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
