import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ComponentStateInfoModule } from '../../common/component-state-info/component-state-info.module';
import { ClassResponse } from './class-response/class-response.component';

@NgModule({
  declarations: [ClassResponse],
  imports: [StudentTeacherCommonModule, ComponentStateInfoModule, StudentComponentModule],
  exports: [ClassResponse]
})
export class DiscussionCommonModule {}
