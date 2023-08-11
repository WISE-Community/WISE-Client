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

  autoScroll: any;
  students: Set<any> = new Set();
  subscriptions: Subscription = new Subscription();
  emptyTeams: Map<number, any> = new Map();
  teams: Map<number, any> = new Map();
  unassignedTeam: any = { users: [] };

  constructor(
    private configService: ConfigService,
    private getWorkgroupService: GetWorkgroupService,
    private workgroupService: WorkgroupService
  ) {}

  ngOnChanges() {
    this.init();
  }

  ngOnInit() {
    this.autoScroll = require('dom-autoscroller');
    this.registerAutoScroll();
    this.subscriptions.add(
      this.configService.configRetrieved$.subscribe(() => {
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
    this.teams = this.workgroupService.getWorkgroupsInPeriod(this.period.periodId);
    this.initEmptyTeams();
    this.initUnassignedTeam();
  }

  private initEmptyTeams() {
    this.emptyTeams.clear();
    this.getWorkgroupService
      .getAllWorkgroupsInPeriod(this.period.periodId)
      .subscribe((workgroups: any[]) => {
        for (const workgroup of workgroups) {
          if (!this.teams.has(workgroup.id)) {
            workgroup.workgroupId = workgroup.id;
            workgroup.users = [];
            this.emptyTeams.set(workgroup.id, workgroup);
          }
        }
      });
  }

  private initUnassignedTeam() {
    this.unassignedTeam = {
      users: this.configService.getUsersNotInWorkgroupInPeriod(this.period.periodId)
    };
  }

  initStudents() {
    this.students.clear();
    for (const workgroup of this.configService.getClassmateUserInfos()) {
      if (workgroup.periodId === this.period.periodId) {
        for (const user of workgroup.users) {
          this.students.add(user);
        }
      }
    }
  }

  registerAutoScroll(): void {
    this.autoScroll([document.querySelector('#content')], {
      margin: 30,
      scrollWhenOutside: true,
      autoScroll: function () {
        return this.down;
      }
    });
  }
}
