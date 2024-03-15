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
  protected nextWorkgroup: Workgroup;
  private periodId: number;
  protected prevWorkgroup: Workgroup;
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
    if (/unit\/(\d*)\/team\/(\w*)$/.test(this.router.url)) {
      this.workgroupId = parseInt(this.router.url.match(/\/team\/(\d+)$/)[1]);
    }
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
          this.router.navigate(['team', this.workgroupId], { relativeTo: this.route });
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
    this.workgroups = this.workgroups
      .sort(this.sortByWorkgroupId)
      .filter((workgroup) => workgroup.workgroupId != null);
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
    this.prevWorkgroup = this.getPreviousWorkgroup(currentWorkgroupIndex);
    this.nextWorkgroup = this.getNextWorkgroup(currentWorkgroupIndex);
  }

  private getPreviousWorkgroup(currentWorkgroupIndex: number): Workgroup {
    return currentWorkgroupIndex > 0 ? this.workgroups[currentWorkgroupIndex - 1] : null;
  }

  private getNextWorkgroup(currentWorkgroupIndex: number): Workgroup {
    return currentWorkgroupIndex < this.workgroups.length - 1
      ? this.workgroups[currentWorkgroupIndex + 1]
      : null;
  }

  protected goToTeam(workgroup: Workgroup): void {
    this.dataService.setCurrentWorkgroup(workgroup);
  }
}
