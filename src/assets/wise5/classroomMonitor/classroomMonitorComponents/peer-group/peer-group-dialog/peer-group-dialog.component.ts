import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { SelectPeriodComponent } from '../../select-period/select-period.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { PeerGroupPeriodComponent } from '../peer-group-period/peer-group-period.component';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    SelectPeriodComponent,
    CdkScrollable,
    MatDialogContent,
    PeerGroupPeriodComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  styleUrl: './peer-group-dialog.component.scss',
  templateUrl: './peer-group-dialog.component.html'
})
export class PeerGroupDialogComponent implements OnInit {
  private currentPeriodChangedSubscription: Subscription;
  protected peerGroupingName: string;
  protected periods: any[];

  constructor(
    private dataService: TeacherDataService,
    @Inject(MAT_DIALOG_DATA) public peerGroupingTag: string,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.setPeriods(this.dataService.getCurrentPeriodId());
    this.peerGroupingName = this.projectService.getPeerGrouping(this.peerGroupingTag).name;
    this.currentPeriodChangedSubscription = this.dataService.currentPeriodChanged$.subscribe(
      ({ currentPeriod }) => {
        this.setPeriods(currentPeriod.periodId);
      }
    );
  }

  ngOnDestroy(): void {
    this.currentPeriodChangedSubscription.unsubscribe();
  }

  private setPeriods(periodId: number): void {
    const allPeriods = this.dataService.getPeriods();
    this.periods =
      periodId === -1
        ? allPeriods.slice(1)
        : [allPeriods.find((period) => period.periodId === periodId)];
  }
}
