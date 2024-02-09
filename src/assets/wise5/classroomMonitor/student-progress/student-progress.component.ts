import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectCompletion } from '../../common/ProjectCompletion';

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
  sortedStudents: StudentProgress[];
  subscriptions: Subscription = new Subscription();
  teacherWorkgroupId: number;
  students: StudentProgress[];

  constructor(
    private classroomStatusService: ClassroomStatusService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacherWorkgroupId = this.configService.getWorkgroupId();
    this.sort = this.dataService.studentProgressSort;
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
      this.dataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        this.currentWorkgroup = currentWorkgroup;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeStudents(): void {
    this.students = [];
    const workgroups = this.configService
      .getClassmateUserInfos()
      .filter((workgroup: any) => workgroup.workgroupId != null);
    for (const workgroup of workgroups) {
      const workgroupId = workgroup.workgroupId;
      const userNames = this.configService
        .getDisplayUsernamesByWorkgroupId(workgroupId)
        .split(', ');
      userNames.forEach((user: any) => {
        const names = user.split(' ');
        const student = new StudentProgress({
          periodId: workgroup.periodId,
          periodName: workgroup.periodName,
          workgroupId: workgroupId,
          username: names[0] + ' ' + names[1],
          firstName: names[0],
          lastName: names[1]
        });
        this.students.push(student);
        this.updateTeam(workgroupId);
      });
    }
    this.sortWorkgroups();
  }

  private updateTeam(workgroupId: number): void {
    const location = this.getCurrentNodeForWorkgroupId(workgroupId) || '';
    const completion = this.classroomStatusService.getStudentProjectCompletion(workgroupId);
    const score = this.getStudentTotalScore(workgroupId);
    let maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(workgroupId);
    maxScore = maxScore ? maxScore : 0;

    for (const student of this.students) {
      if (student.workgroupId === workgroupId) {
        student.location = location;
        student.completion = completion;
        student.completionPct = completion.completionPct || 0;
        student.score = score;
        student.maxScore = maxScore;
        student.scorePct = maxScore ? score / maxScore : score;
      }
    }
  }

  private getCurrentNodeForWorkgroupId(workgroupId: number): string {
    return this.classroomStatusService.getCurrentNodePositionAndNodeTitleForWorkgroupId(
      workgroupId
    );
  }

  private getStudentTotalScore(workgroupId: number): number {
    return this.dataService.getTotalScoreByWorkgroupId(workgroupId);
  }

  private sortWorkgroups(): void {
    this.sortedStudents = [...this.students];
    switch (this.sort) {
      case 'team':
        this.sortedStudents.sort(this.createSortTeam('asc'));
        break;
      case '-team':
        this.sortedStudents.sort(this.createSortTeam('desc'));
        break;
      case 'student':
        this.sortedStudents.sort(this.createSortStudent('asc'));
        break;
      case '-student':
        this.sortedStudents.sort(this.createSortStudent('desc'));
        break;
      case 'firstName':
        this.sortedStudents.sort(this.createSortFirstName('asc'));
        break;
      case '-firstName':
        this.sortedStudents.sort(this.createSortFirstName('desc'));
        break;
      case 'lastName':
        this.sortedStudents.sort(this.createSortLastName('asc'));
        break;
      case '-lastName':
        this.sortedStudents.sort(this.createSortLastName('desc'));
        break;
      case 'score':
        this.sortedStudents.sort(this.createSortScore('asc'));
        break;
      case '-score':
        this.sortedStudents.sort(this.createSortScore('desc'));
        break;
      case 'completion':
        this.sortedStudents.sort(this.createSortCompletion('asc'));
        break;
      case '-completion':
        this.sortedStudents.sort(this.createSortCompletion('desc'));
        break;
      case 'location':
        this.sortedStudents.sort(this.createSortLocation('asc'));
        break;
      case '-location':
        this.sortedStudents.sort(this.createSortLocation('desc'));
        break;
    }
  }

  private createSortTeam(direction: string): any {
    return (studentA: any, studentB: any): number => {
      return direction === 'asc'
        ? studentA.workgroupId - studentB.workgroupId
        : studentB.workgroupId - studentA.workgroupId;
    };
  }

  private createSortStudent(direction: string): any {
    return (studentA: any, studentB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? studentA.username.localeCompare(studentB.username)
          : studentB.username.localeCompare(studentA.username);
      return localeCompare === 0 ? studentA.workgroupId - studentB.workgroupId : localeCompare;
    };
  }

  private createSortFirstName(direction: string): any {
    return (studentA: any, studentB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? studentA.firstName.localeCompare(studentB.firstName)
          : studentB.firstName.localeCompare(studentA.firstName);
      return localeCompare === 0 ? studentA.workgroupId - studentB.workgroupId : localeCompare;
    };
  }

  private createSortLastName(direction: string): any {
    return (studentA: any, studentB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? studentA.lastName.localeCompare(studentB.lastName)
          : studentB.lastName.localeCompare(studentA.lastName);
      return localeCompare === 0 ? studentA.workgroupId - studentB.workgroupId : localeCompare;
    };
  }

  private createSortScore(direction: string): any {
    return (studentA: any, studentB: any): number => {
      if (studentA.scorePct === studentB.scorePct) {
        return studentA.workgroupId
          .toString()
          .localeCompare(studentB.workgroupId.toString(), undefined, {
            numeric: true
          });
      }
      return direction === 'asc'
        ? studentA.scorePct - studentB.scorePct
        : studentB.scorePct - studentA.scorePct;
    };
  }

  private createSortCompletion(direction: string): any {
    return (studentA: any, studentB: any): number => {
      const completionA = studentA.completionPct;
      const completionB = studentB.completionPct;
      if (completionA === completionB) {
        return studentA.workgroupId
          .toString()
          .localeCompare(studentB.workgroupId.toString(), undefined, {
            numeric: true
          });
      }
      return direction === 'asc' ? completionA - completionB : completionB - completionA;
    };
  }

  private createSortLocation(direction: string): any {
    return (studentA: any, studentB: any): number => {
      const localeCompare =
        direction === 'asc'
          ? studentA.location.localeCompare(studentB.location)
          : studentB.location.localeCompare(studentA.location);
      return localeCompare === 0
        ? studentA.workgroupId
            .toString()
            .localeCompare(studentB.workgroupId.toString(), undefined, { numeric: true })
        : localeCompare;
    };
  }

  isWorkgroupShown(workgroup: number): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  showStudentGradingView(workgroup: any): void {
    if (this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)) {
      this.router.navigate([workgroup.workgroupId], { relativeTo: this.route });
    }
  }

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.dataService.studentProgressSort = this.sort;
    this.sortWorkgroups();
  }
}

export class StudentProgress {
  periodId: string;
  periodName: string;
  workgroupId: number;
  username: string;
  firstName: string;
  lastName: string;
  location: string;
  completion: ProjectCompletion;
  completionPct: number;
  score: number;
  maxScore: number;
  scorePct: number;

  constructor(jsonObject: any = {}) {
    for (const key of Object.keys(jsonObject)) {
      this[key] = jsonObject[key];
    }
  }
}
