import { NgModule } from '@angular/core';
import { PeerGroupGradingModule } from './peer-group-grading.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

@NgModule({
  imports: [ComponentStudentModule, PeerGroupGradingModule, StudentTeacherCommonServicesModule]
})
export class ClassroomMonitorModule {}
