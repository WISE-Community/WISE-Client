import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  declarations: [SelectPeriodComponent],
  exports: [SelectPeriodComponent]
})
export class SelectPeriodModule {}
