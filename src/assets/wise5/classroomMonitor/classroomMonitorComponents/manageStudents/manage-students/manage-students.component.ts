import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';

@Component({
  selector: 'manage-students',
  templateUrl: 'manage-students.component.html'
})
export class ManageStudentsComponent {
  period: any;
  subscriptions: Subscription = new Subscription();

  constructor(private TeacherDataService: TeacherDataService) {}

  ngOnInit() {
    this.period = this.TeacherDataService.getCurrentPeriod();
    this.subscriptions.add(
      this.TeacherDataService.currentPeriodChanged$.subscribe(({ currentPeriod }) => {
        this.period = currentPeriod;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
