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

  constructor(private dataService: TeacherDataService) {}

  ngOnInit() {
    this.setVisiblePeriods(this.dataService.getCurrentPeriod());
    this.subscriptions.add(
      this.dataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.setVisiblePeriods(currentPeriod);
      })
    );
  }

  setVisiblePeriods(currentPeriod: any): void {
    this.periods = currentPeriod.periodId === -1 ? this.dataService.getPeriods() : [currentPeriod];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
