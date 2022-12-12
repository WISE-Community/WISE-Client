import { Component, Input, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { UtilService } from '../../../../services/utilService';

class Workgroup {
  periodId: number;
  workgroupId: number;
}

@Component({
  selector: 'student-grading-tools',
  templateUrl: './student-grading-tools.component.html'
})
export class StudentGradingToolsComponent implements OnInit {
  avatarColor: string;
  currentPeriodChangedSubscription: Subscription;
  icons: any;
  is_rtl: boolean;
  nextId: number;
  periodId: number;
  prevId: number;
  @Input() workgroupId: number;
  workgroups: Workgroup[];

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private upgrade: UpgradeModule,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.currentPeriodChangedSubscription = this.dataService.currentPeriodChanged$.subscribe(() => {
      this.updateModel();
    });
  }

  ngOnDestroy(): void {
    this.currentPeriodChangedSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.updateModel();
  }

  private updateModel(): void {
    this.avatarColor = this.configService.getAvatarColorForWorkgroupId(this.workgroupId);
    this.periodId = this.dataService.getCurrentPeriod().periodId;
    this.filterWorkgroupsForPeriod();
    this.workgroups = this.workgroups.sort(this.sortByWorkgroupId);
    this.setNextAndPrev();
  }

  private sortByWorkgroupId(a: Workgroup, b: Workgroup): number {
    return a.workgroupId - b.workgroupId;
  }

  private filterWorkgroupsForPeriod(): void {
    this.workgroups = this.utilService
      .makeCopyOfJSONObject(this.configService.getClassmateUserInfos())
      .filter((workgroup) => this.periodId === -1 || workgroup.periodId === this.periodId);
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

  goToPrevTeam(): void {
    this.upgrade.$injector.get('$state').go('root.cm.team', { workgroupId: this.prevId });
  }

  goToNextTeam(): void {
    this.upgrade.$injector.get('$state').go('root.cm.team', { workgroupId: this.nextId });
  }
}
