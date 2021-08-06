import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'manage-students',
  styleUrls: ['manage-students.component.scss'],
  templateUrl: 'manage-students.component.html'
})
export class ManageStudentsComponent {
  periods: any[];
  subscriptions: Subscription = new Subscription();

  constructor(private TeacherDataService: TeacherDataService) {}

  ngOnInit() {
    this.setVisiblePeriods(this.TeacherDataService.getCurrentPeriod());
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.setVisiblePeriods(currentPeriod);
      })
    );
  }

  setVisiblePeriods(currentPeriod: any): void {
    if (currentPeriod.periodId === -1) {
      this.periods = this.TeacherDataService.getPeriods();
    } else {
      this.periods = [currentPeriod];
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
