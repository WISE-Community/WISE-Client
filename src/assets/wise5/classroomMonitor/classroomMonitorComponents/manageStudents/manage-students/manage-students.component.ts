import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { ManagePeriodComponent } from '../manage-period/manage-period.component';

@Component({
  imports: [ManagePeriodComponent],
  selector: 'manage-students',
  styleUrl: 'manage-students.component.scss',
  templateUrl: 'manage-students.component.html'
})
export class ManageStudentsComponent {
  private dataService = inject(TeacherDataService);

  protected periods: any[];
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
