import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { copy } from '../../../../common/object/object';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

class Workgroup {
  periodId: number;
  workgroupId: number;
}

@Component({
  selector: 'student-grading-tools',
  templateUrl: './student-grading-tools.component.html'
})
export class StudentGradingToolsComponent implements OnInit {
  protected avatarColor: string;
  protected nextId: number;
  private periodId: number;
  protected prevId: number;
  private subscriptions: Subscription = new Subscription();
  private workgroupId: number;
  private workgroups: Workgroup[];

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateModel();
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.dataService.currentWorkgroupChanged$
        .pipe(filter((workgroup) => workgroup.currentWorkgroup != null))
        .subscribe(({ currentWorkgroup }) => {
          this.workgroupId = currentWorkgroup.workgroupId;
          this.updateModel();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(): void {
    this.updateModel();
  }

  private updateModel(): void {
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.periodId = this.dataService.getCurrentPeriod().periodId;
    this.filterWorkgroupsForPeriod();
    this.workgroups = this.workgroups.sort(this.sortByWorkgroupId);
    this.setNextAndPrev();
  }

  private sortByWorkgroupId(a: Workgroup, b: Workgroup): number {
    return a.workgroupId - b.workgroupId;
  }

  private filterWorkgroupsForPeriod(): void {
    this.workgroups = copy(this.configService.getClassmateUserInfos()).filter(
      (workgroup) => this.periodId === -1 || workgroup.periodId === this.periodId
    );
  }

  private setNextAndPrev(): void {
    const currentWorkgroupIndex = this.workgroups.findIndex(
      (workgroup) => workgroup.workgroupId === this.workgroupId
    );
    this.prevId = this.getPreviousWorkgroupId(currentWorkgroupIndex);
    this.nextId = this.getNextWorkgroupId(currentWorkgroupIndex);
  }

  private getPreviousWorkgroupId(currentWorkgroupIndex: number): number {
    return currentWorkgroupIndex > 0
      ? this.workgroups[currentWorkgroupIndex - 1].workgroupId
      : null;
  }

  private getNextWorkgroupId(currentWorkgroupIndex: number): number {
    return currentWorkgroupIndex < this.workgroups.length - 1
      ? this.workgroups[currentWorkgroupIndex + 1].workgroupId
      : null;
  }

  protected goToPrevTeam(): void {
    this.router.navigate(['team', this.prevId], { relativeTo: this.route });
  }

  protected goToNextTeam(): void {
    this.router.navigate(['team', this.nextId], { relativeTo: this.route });
  }
}
