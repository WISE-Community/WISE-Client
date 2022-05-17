import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'peer-group-dialog',
  templateUrl: './peer-group-dialog.component.html',
  styleUrls: ['./peer-group-dialog.component.scss']
})
export class PeerGroupDialogComponent implements OnInit {
  currentPeriodChangedSubscription: Subscription;
  peerGroupingName: string;
  periods: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGroupingTag: string,
    private teacherDataService: TeacherDataService,
    private teacherProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.setPeriods(this.teacherDataService.getCurrentPeriodId());
    this.peerGroupingName = this.teacherProjectService.getPeerGrouping(this.peerGroupingTag).name;
    this.subscribeToPeriodChanged();
  }

  subscribeToPeriodChanged(): void {
    this.currentPeriodChangedSubscription = this.teacherDataService.currentPeriodChanged$.subscribe(
      ({ currentPeriod }) => {
        this.setPeriods(currentPeriod.periodId);
      }
    );
  }

  setPeriods(periodId: number): void {
    this.periods = this.teacherDataService.getVisiblePeriodsById(periodId);
  }

  ngOnDestroy() {
    this.currentPeriodChangedSubscription.unsubscribe();
  }
}
