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
  sortOptions: any = {
    team: {
      label: $localize`Team`,
      fieldName: 'workgroupId',
      isNumeric: true
    },
    student: {
      label: $localize`Student`,
      fieldName: 'username',
      isNumeric: false
    },
    firstName: {
      label: $localize`First Name`,
      fieldName: 'firstName',
      isNumeric: false
    },
    lastName: {
      label: $localize`Last Name`,
      fieldName: 'lastName',
      isNumeric: false
    },
    location: {
      label: $localize`Location`,
      fieldName: 'order',
      isNumeric: true
    },
    completion: {
      label: $localize`Completion`,
      fieldName: 'completionPct',
      isNumeric: true
    },
    score: {
      label: $localize`Score`,
      fieldName: 'scorePct',
      isNumeric: true
    }
  };
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
    this.sortWorkgroups();
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
  }

  private updateTeam(workgroupId: number): void {
    const location = this.classroomStatusService.getCurrentNodeLocationForWorkgroupId(workgroupId);
    const completion = this.classroomStatusService.getStudentProjectCompletion(workgroupId);
    const score = this.getStudentTotalScore(workgroupId) || 0;
    let maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(workgroupId);
    maxScore = maxScore ? maxScore : 0;

    for (const student of this.students) {
      if (student.workgroupId === workgroupId) {
        student.position = location?.position || '';
        student.order = location?.order || 0;
        student.completion = completion;
        student.completionPct = completion.completionPct || 0;
        student.score = score;
        student.maxScore = maxScore;
        student.scorePct = maxScore ? score / maxScore : score;
      }
    }
  }

  private getStudentTotalScore(workgroupId: number): number {
    return this.dataService.getTotalScoreByWorkgroupId(workgroupId);
  }

  private sortWorkgroups(): void {
    this.sortedStudents = [...this.students];
    const dir = this.sort.charAt(0) === '-' ? 'desc' : 'asc';
    const sort = this.sort.charAt(0) === '-' ? this.sort.slice(1) : this.sort;
    this.sortedStudents.sort(
      this.createSort(this.sortOptions[sort].fieldName, dir, this.sortOptions[sort].isNumeric)
    );
  }

  private createSort(fieldName: string, direction: 'asc' | 'desc', isNumeric: boolean): any {
    return (studentA: StudentProgress, studentB: StudentProgress): number => {
      const localeCompare = this.localeCompareBy(
        fieldName,
        studentA,
        studentB,
        direction,
        isNumeric
      );
      return fieldName !== 'workgroupId' && localeCompare === 0
        ? this.localeCompareBy('workgroupId', studentA, studentB, 'asc', true)
        : localeCompare;
    };
  }

  private localeCompareBy(
    fieldName: string,
    studentA: any,
    studentB: any,
    direction: 'asc' | 'desc',
    isNumeric: boolean
  ): number {
    const valueA = studentA[fieldName];
    const valueB = studentB[fieldName];
    if (isNumeric) {
      const numA = parseFloat(valueA);
      const numB = parseFloat(valueB);
      return direction === 'asc' ? numA - numB : numB - numA;
    }
    return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
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
  position: string;
  order: number;
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
