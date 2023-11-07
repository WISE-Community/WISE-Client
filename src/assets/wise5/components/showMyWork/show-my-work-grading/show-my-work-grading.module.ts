import { NgModule } from '@angular/core';
import { ShowMyWorkGradingComponent } from './show-my-work-grading.component';
import { ShowWorkStudentModule } from '../../showWork/show-work-student/show-work-student.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ShowMyWorkGradingComponent],
  imports: [CommonModule, ShowWorkStudentModule],
  exports: [ShowMyWorkGradingComponent]
})
export class ShowMyWorkGradingModule {}
