import { NgModule } from '@angular/core';
import { ShowMyWorkGradingComponent } from './show-my-work-grading.component';
import { CommonModule } from '@angular/common';
import { ShowWorkStudentComponent } from '../../showWork/show-work-student/show-work-student.component';

@NgModule({
  declarations: [ShowMyWorkGradingComponent],
  imports: [CommonModule, ShowWorkStudentComponent],
  exports: [ShowMyWorkGradingComponent]
})
export class ShowMyWorkGradingModule {}
