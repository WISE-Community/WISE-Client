import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';

@Directive()
export class WorkgroupSelectComponent {
  @Input() customClass: string;
  protected canViewStudentNames: boolean;
  protected periodId: number;
  protected selectedItem: any;
  protected subscriptions: Subscription = new Subscription();
  protected workgroups: any;

  constructor(
    protected configService: ConfigService,
    protected dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.periodId = this.dataService.getCurrentPeriod().periodId;
    this.setWorkgroups();
    this.subscriptions.add(
      this.dataService.currentWorkgroupChanged$.subscribe(({ currentWorkgroup }) => {
        if (currentWorkgroup != null) {
          this.setWorkgroups();
          this.setWorkgroup(currentWorkgroup);
        }
      })
    );
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.setWorkgroups();
        this.currentPeriodChanged();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected setWorkgroups() {}

  protected setWorkgroup(workgroup: any): void {}

  protected currentPeriodChanged() {}

  protected sortByField(arr: any[], field: string): any[] {
    return arr.sort((workgroup1, workgroup2) => {
      return workgroup1[field] - workgroup2[field];
    });
  }

  protected sortByDisplayNames(arr: any[]): any[] {
    return arr.sort((workgroup1, workgroup2) => {
      return workgroup1.displayNames.localeCompare(workgroup2.displayNames);
    });
  }

  protected filterWorkgroupsBySelectedPeriod(): void {
    this.workgroups = this.configService.getClassmateUserInfos().filter((workgroup) => {
      return (
        (this.periodId === -1 || workgroup.periodId === this.periodId) &&
        workgroup.workgroupId != null
      );
    });
  }

  protected setCurrentWorkgroup(workgroup): void {
    this.dataService.setCurrentWorkgroup(workgroup);
  }
}
