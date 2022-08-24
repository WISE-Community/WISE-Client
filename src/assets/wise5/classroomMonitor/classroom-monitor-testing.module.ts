import { NgModule } from '@angular/core';
import { ClassroomStatusService } from '../services/classroomStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { StudentTeacherCommonServicesModule } from '../../../app/student-teacher-common-services.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';

@NgModule({
  imports: [
    HttpClientTestingModule,
    MatDialogModule,
    StudentTeacherCommonServicesModule,
    UpgradeModule
  ],
  providers: [
    ClassroomStatusService,
    TeacherDataService,
    TeacherProjectService,
    TeacherWebSocketService
  ]
})
export class ClassroomMonitorTestingModule {}
