import { Component, Input, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { ConfigService } from '../../../../services/configService';
import { GetWorkgroupService } from '../../../../../../app/services/getWorkgroupService';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { AddTeamButtonComponent } from '../add-team-button/add-team-button.component';
import { ManageTeamComponent } from '../manage-team/manage-team.component';
import { ManageTeamsComponent } from '../manage-teams/manage-teams.component';

@Component({
  imports: [
    MatCard,
    CdkDropListGroup,
    MatCardContent,
    AddTeamButtonComponent,
    ManageTeamComponent,
    ManageTeamsComponent
  ],
  selector: 'manage-period',
  styleUrl: 'manage-period.component.scss',
  templateUrl: 'manage-period.component.html'
})
export class ManagePeriodComponent {
  private configService = inject(ConfigService);
  private getWorkgroupService = inject(GetWorkgroupService);
  private workgroupService = inject(WorkgroupService);

  emptyTeams: Map<number, any> = new Map();
  @Input() period: any;
  students: Set<any> = new Set();
  private subscriptions: Subscription = new Subscription();
  teams: Map<number, any> = new Map();
  unassignedTeam: any = { users: [] };

  ngOnChanges(): void {
    this.init();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.configService.configRetrieved$.subscribe(() => {
        this.init();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  init(): void {
    this.initTeams();
    this.initStudents();
  }

  initTeams(): void {
    this.teams = this.workgroupService.getWorkgroupsInPeriod(this.period.periodId);
    this.initEmptyTeams();
    this.initUnassignedTeam();
  }

  private initEmptyTeams(): void {
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

  private initUnassignedTeam(): void {
    this.unassignedTeam = {
      users: this.configService.getUsersNotInWorkgroupInPeriod(this.period.periodId)
    };
  }

  initStudents(): void {
    this.students.clear();
    for (const workgroup of this.configService.getClassmateUserInfos()) {
      if (workgroup.periodId === this.period.periodId) {
        for (const user of workgroup.users) {
          this.students.add(user);
        }
      }
    }
  }
}
