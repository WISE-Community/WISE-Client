import { NgModule } from '@angular/core';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

@NgModule({
  imports: [ComponentStudentModule, StudentTeacherCommonServicesModule]
})
export class ClassroomMonitorModule {}
