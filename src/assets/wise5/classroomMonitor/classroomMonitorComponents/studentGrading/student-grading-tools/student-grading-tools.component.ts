import { Component, Input, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { UtilService } from '../../../../services/utilService';

@Component({
  selector: 'student-grading-tools',
  templateUrl: './student-grading-tools.component.html'
})
export class StudentGradingToolsComponent implements OnInit {
  avatarColor: string;
  currentPeriodChangedSubscription: Subscription;
  icons: any;
  is_rtl: boolean;
  nextId: any;
  periodId: number;
  prevId: any;
  @Input() workgroupId: number;
  workgroups: any;

  constructor(
    private configService: ConfigService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.currentPeriodChangedSubscription = this.teacherDataService.currentPeriodChanged$.subscribe(
      ({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.filterForPeriod();
      }
    );
  }

  ngOnDestroy(): void {
    this.currentPeriodChangedSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.avatarColor = this.configService.getAvatarColorForWorkgroupId(this.workgroupId);
    this.periodId = this.teacherDataService.getCurrentPeriod().periodId;
    const workgroups = this.utilService.makeCopyOfJSONObject(
      this.configService.getClassmateUserInfos()
    );
    this.workgroups = workgroups.sort(this.sortByWorkgroupId);
    this.filterForPeriod();
  }

  sortByWorkgroupId(a: any, b: any): number {
    return a.workgroupId - b.workgroupId;
  }

  filterForPeriod(): void {
    for (const workgroup of this.workgroups) {
      const periodId = workgroup.periodId;
      if (this.periodId === -1 || periodId === this.periodId) {
        workgroup.visible = true;
      } else {
        workgroup.visible = false;
      }
    }
    this.setNextAndPrev();
  }

  setNextAndPrev(): void {
    const currentWorkgroupId = this.workgroupId;
    this.prevId = this.getPreviousWorkgroupId(currentWorkgroupId);
    this.nextId = this.getNextWorkgroupId(currentWorkgroupId);
  }

  getPreviousWorkgroupId(workgroupId: number): number {
    const indexOfWorkgroupId = this.getIndexOfWorkgroupId(workgroupId);
    for (let i = indexOfWorkgroupId - 1; i >= 0; i--) {
      const prevWorkgroup = this.workgroups[i];
      if (prevWorkgroup.visible) {
        return prevWorkgroup.workgroupId;
      }
    }
    return null;
  }

  getNextWorkgroupId(workgroupId: number): number {
    const indexOfWorkgroupId = this.getIndexOfWorkgroupId(workgroupId);
    for (let i = indexOfWorkgroupId + 1; i < this.workgroups.length; i++) {
      const nextWorkgroup = this.workgroups[i];
      if (nextWorkgroup.visible) {
        return nextWorkgroup.workgroupId;
      }
    }
    return null;
  }

  getIndexOfWorkgroupId(workgroupId: number): number {
    for (let i = 0; i < this.workgroups.length; i++) {
      if (this.workgroups[i].workgroupId === workgroupId) {
        return i;
      }
    }
    return null;
  }

  goToPrevTeam(): void {
    this.upgrade.$injector.get('$state').go('root.cm.team', { workgroupId: this.prevId });
  }

  goToNextTeam(): void {
    this.upgrade.$injector.get('$state').go('root.cm.team', { workgroupId: this.nextId });
  }
}
