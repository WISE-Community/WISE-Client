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
    this.sortedTeams = [...this.teams];
    switch (this.sort) {
      case 'team':
        this.sortedTeams.sort(this.createSortTeam('asc'));
        break;
      case '-team':
        this.sortedTeams.sort(this.createSortTeam('desc'));
        break;
      case 'student':
        this.sortedTeams.sort(this.createSortStudent('asc'));
        break;
      case '-student':
        this.sortedTeams.sort(this.createSortStudent('desc'));
        break;
      case 'score':
        this.sortedTeams.sort(this.createSortScore('asc'));
        break;
      case '-score':
        this.sortedTeams.sort(this.createSortScore('desc'));
        break;
      case 'completion':
        this.sortedTeams.sort(this.createSortCompletion('asc'));
        break;
      case '-completion':
        this.sortedTeams.sort(this.createSortCompletion('desc'));
        break;
      case 'location':
        this.sortedTeams.sort(this.createSortLocation('asc'));
        break;
      case '-location':
        this.sortedTeams.sort(this.createSortLocation('desc'));
        break;
    }
  }

  private createSortTeam(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      return direction === 'asc'
        ? workgroupA.workgroupId - workgroupB.workgroupId
        : workgroupB.workgroupId - workgroupA.workgroupId;
    };
  }

  private createSortStudent(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? workgroupA.username.localeCompare(workgroupB.username)
          : workgroupB.username.localeCompare(workgroupA.username);
      return localeCompare === 0 ? workgroupA.workgroupId - workgroupB.workgroupId : localeCompare;
    };
  }

  private createSortScore(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      if (workgroupA.scorePct === workgroupB.scorePct) {
        return workgroupA.username.localeCompare(workgroupB.username);
      }
      return direction === 'asc'
        ? workgroupA.scorePct - workgroupB.scorePct
        : workgroupB.scorePct - workgroupA.scorePct;
    };
  }

  private createSortCompletion(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      const completionA = workgroupA.completion.completionPct;
      const completionB = workgroupB.completion.completionPct;
      if (completionA === completionB) {
        return workgroupA.username.localeCompare(workgroupB.username);
      }
      return direction === 'asc' ? completionA - completionB : completionB - completionA;
    };
  }

  private createSortLocation(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? workgroupA.location.localeCompare(workgroupB.location)
          : workgroupB.location.localeCompare(workgroupA.location);
      return localeCompare === 0
        ? workgroupA.username.localeCompare(workgroupB.username)
        : localeCompare;
    };
  }

  isWorkgroupShown(workgroup: number): boolean {
    return this.teacherDataService.isWorkgroupShown(workgroup);
  }

  showStudentGradingView(workgroup: any): void {
    if (this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)) {
      this.upgrade.$injector
        .get('$state')
        .go('root.cm.team', { workgroupId: workgroup.workgroupId });
    }
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
