import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { TeacherDataService } from '../../services/teacherDataService';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { WorkgroupSelectAutocompleteComponent } from '../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { ProjectProgressComponent } from '../classroomMonitorComponents/studentProgress/project-progress/project-progress.component';
import { ProjectLocationComponent } from '../project-location/project-location.component';
import { StudentProgress } from './StudentProgress';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    ProjectLocationComponent,
    ProjectProgressComponent,
    WorkgroupSelectAutocompleteComponent
  ],
  selector: 'student-progress',
  styleUrl: './student-progress.component.scss',
  templateUrl: './student-progress.component.html'
})
export class StudentProgressComponent implements OnInit {
  protected permissions: any;
  protected sort: any;
  protected sortedStudents: StudentProgress[];
  private subscriptions: Subscription = new Subscription();
  protected sortOptions: any = {
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
  private students: StudentProgress[] = [];

  constructor(
    private classroomStatusService: ClassroomStatusService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sort = this.dataService.studentProgressSort;
    this.permissions = this.configService.getPermissions();
    this.initializeStudents();
    this.sortWorkgroups();
    this.subscriptions.add(
      this.classroomStatusService.studentStatusReceived$.subscribe((args) => {
        this.updateTeam(args.studentStatus.workgroupId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeStudents(): void {
    this.configService
      .getClassmateUserInfos()
      .filter((workgroup: any) => workgroup.workgroupId != null)
      .forEach((workgroup: any) => {
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
      });
  }

  private updateTeam(workgroupId: number): void {
    const location = this.classroomStatusService.getCurrentNodeLocationForWorkgroupId(workgroupId);
    const completion = this.classroomStatusService.getStudentProjectCompletion(workgroupId);
    const score = this.getStudentTotalScore(workgroupId) || 0;
    const maxScore = this.classroomStatusService.getMaxScoreForWorkgroupId(workgroupId) ?? 0;
    this.students
      .filter((student) => student.workgroupId === workgroupId)
      .forEach((student) => {
        student.currentNodeId = location?.nodeId || '';
        student.nodePosition = location?.nodePosition || '';
        student.positionAndTitle = location?.positionAndTitle || '';
        student.order = location?.order || 0;
        student.completion = completion;
        student.completionPct = completion.completionPct || 0;
        student.score = score;
        student.maxScore = maxScore;
        student.scorePct = maxScore ? score / maxScore : score;
      });
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

  protected isWorkgroupShown(workgroup: number): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  protected showStudentGradingView(workgroup: any): void {
    if (this.classroomStatusService.hasStudentStatus(workgroup.workgroupId)) {
      this.router.navigate([workgroup.workgroupId], { relativeTo: this.route });
    }
  }

  protected setSort(value: string): void {
    this.sort = this.sort === value ? `-${value}` : value;
    this.dataService.studentProgressSort = this.sort;
    this.sortWorkgroups();
  }
}
