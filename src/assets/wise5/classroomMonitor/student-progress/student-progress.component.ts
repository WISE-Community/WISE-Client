import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { TeacherDataService } from '../../services/teacherDataService';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'student-progress',
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentProgressComponent implements OnInit {
  currentWorkgroup: any;
  permissions: any;
  sort: any;
  sortedTeams: any[];
  subscriptions: Subscription = new Subscription();
  teacherWorkgroupId: number;
  teams: any;

  constructor(
    private classroomStatusService: ClassroomStatusService,
    private configService: ConfigService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.teacherWorkgroupId = this.configService.getWorkgroupId();
    this.sort = this.teacherDataService.studentProgressSort;
    this.permissions = this.configService.getPermissions();
    this.initializeStudents();
    this.subscriptions.add(
      this.classroomStatusService.studentStatusReceived$.subscribe((args) => {
        const studentStatus = args.studentStatus;
        const workgroupId = studentStatus.workgroupId;
        this.updateTeam(workgroupId);
      })
    );
    this.subscriptions.add(
      this.teacherDataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        this.currentWorkgroup = currentWorkgroup;
      })
    );
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'studentProgressViewDisplayed',
      data = {};
    this.teacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeStudents(): void {
    this.teams = [];
    const workgroups = this.configService.getClassmateUserInfos();
    for (const workgroup of workgroups) {
      const workgroupId = workgroup.workgroupId;
      const displayNames = this.configService.getDisplayUsernamesByWorkgroupId(workgroupId);
      const team = {
        periodId: workgroup.periodId,
        periodName: workgroup.periodName,
        workgroupId: workgroupId,
        username: displayNames
      };
      this.teams.push(team);
      this.updateTeam(workgroupId);
    }
    this.sortWorkgroups();
  }

  private updateTeam(workgroupId: number): void {
    const location = this.getCurrentNodeForWorkgroupId(workgroupId);
    const completion = this.getStudentProjectCompletion(workgroupId);
    const score = this.getStudentTotalScore(workgroupId);
    let maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(workgroupId);
    maxScore = maxScore ? maxScore : 0;

    for (const team of this.teams) {
      if (team.workgroupId === workgroupId) {
        team.location = location;
        team.completion = completion;
        team.score = score;
        team.maxScore = maxScore;
        team.scorePct = maxScore ? score / maxScore : score;
      }
    }
  }

  private getCurrentNodeForWorkgroupId(workgroupId: number): string {
    return this.classroomStatusService.getCurrentNodePositionAndNodeTitleForWorkgroupId(
      workgroupId
    );
  }

  /**
   * Get project completion data for the given workgroup (only include nodes with student work)
   * @param workgroupId the workgroup id
   * @return object with completed, total, and percent completed (integer between 0 and 100)
   */
  private getStudentProjectCompletion(workgroupId: number): any {
    return this.classroomStatusService.getStudentProjectCompletion(workgroupId, true);
  }

  private getStudentTotalScore(workgroupId: number): number {
    return this.teacherDataService.getTotalScoreByWorkgroupId(workgroupId);
  }

  private sortWorkgroups(): void {
    this.sortedTeams = [];
    for (const team of this.teams) {
      this.sortedTeams.push(team);
    }
    switch (this.sort) {
      case 'team':
        this.sortedTeams.sort(this.sortTeamAscending);
        break;
      case '-team':
        this.sortedTeams.sort(this.sortTeamDescending);
        break;
      case 'student':
        this.sortedTeams.sort(this.sortStudentAscending);
        break;
      case '-student':
        this.sortedTeams.sort(this.sortStudentDescending);
        break;
      case 'score':
        this.sortedTeams.sort(this.sortScoreAscending);
        break;
      case '-score':
        this.sortedTeams.sort(this.sortScoreDescending);
        break;
      case 'completion':
        this.sortedTeams.sort(this.sortCompletionAscending);
        break;
      case '-completion':
        this.sortedTeams.sort(this.sortCompletionDescending);
        break;
      case 'location':
        this.sortedTeams.sort(this.sortLocationAscending);
        break;
      case '-location':
        this.sortedTeams.sort(this.sortLocationDescending);
        break;
    }
  }

  private sortTeamAscending(workgroupA: any, workgroupB: any): number {
    return workgroupA.workgroupId - workgroupB.workgroupId;
  }

  private sortTeamDescending(workgroupA: any, workgroupB: any): number {
    return workgroupB.workgroupId - workgroupA.workgroupId;
  }

  private sortStudentAscending(workgroupA: any, workgroupB: any): number {
    const localeCompare = workgroupA.username.localeCompare(workgroupB.username);
    if (localeCompare === 0) {
      return workgroupA.workgroupId - workgroupB.workgroupId;
    } else {
      return localeCompare;
    }
  }

  private sortStudentDescending(workgroupA: any, workgroupB: any): number {
    const localeCompare = workgroupB.username.localeCompare(workgroupA.username);
    if (localeCompare === 0) {
      return workgroupB.workgroupId - workgroupA.workgroupId;
    } else {
      return localeCompare;
    }
  }

  private sortScoreAscending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.scorePct === workgroupB.scorePct) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return workgroupA.scorePct - workgroupB.scorePct;
    }
  }

  private sortScoreDescending(workgroupA: any, workgroupB: any): number {
    if (workgroupA.scorePct === workgroupB.scorePct) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return workgroupB.scorePct - workgroupA.scorePct;
    }
  }

  private sortCompletionAscending(workgroupA: any, workgroupB: any): number {
    const completionA = workgroupA.completion.completionPct;
    const completionB = workgroupB.completion.completionPct;
    if (completionA === completionB) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return completionA - completionB;
    }
  }

  private sortCompletionDescending(workgroupA: any, workgroupB: any): number {
    const completionA = workgroupA.completion.completionPct;
    const completionB = workgroupB.completion.completionPct;
    if (completionA === completionB) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return completionB - completionA;
    }
  }

  private sortLocationAscending(workgroupA: any, workgroupB: any): number {
    const localeCompare = workgroupA.location.localeCompare(workgroupB.location);
    if (localeCompare === 0) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return localeCompare;
    }
  }

  private sortLocationDescending(workgroupA: any, workgroupB: any): number {
    const localeCompare = workgroupB.location.localeCompare(workgroupA.location);
    if (localeCompare === 0) {
      return workgroupA.username.localeCompare(workgroupB.username);
    } else {
      return localeCompare;
    }
  }

  isWorkgroupShown(workgroup: number): boolean {
    return this.teacherDataService.isWorkgroupShown(workgroup);
  }

  showStudentGradingView(workgroup: any): void {
    this.upgrade.$injector.get('$state').go('root.cm.team', { workgroupId: workgroup.workgroupId });
  }

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.teacherDataService.studentProgressSort = this.sort;
    this.sortWorkgroups();
  }
}
