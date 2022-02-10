import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'peer-group-dialog',
  templateUrl: './peer-group-dialog.component.html',
  styleUrls: ['./peer-group-dialog.component.scss']
})
export class PeerGroupDialogComponent implements OnInit {
  currentPeriodChangedSubscription: Subscription;
  periods: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGroupActivityTag: string,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.setPeriods(this.TeacherDataService.getCurrentPeriodId());
    this.subscribeToPeriodChanged();
  }

  subscribeToPeriodChanged(): void {
    this.currentPeriodChangedSubscription = this.TeacherDataService.currentPeriodChanged$.subscribe(
      ({ currentPeriod }) => {
        this.setPeriods(currentPeriod.periodId);
      }
    );
  }

  setPeriods(periodId: number): void {
    this.periods = this.TeacherDataService.getVisiblePeriodsById(periodId);
  }

  ngOnDestroy() {
    this.currentPeriodChangedSubscription.unsubscribe();
  }
}
