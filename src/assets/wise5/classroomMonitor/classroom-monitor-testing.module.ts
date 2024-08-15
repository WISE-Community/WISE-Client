import { NgModule } from '@angular/core';
import { ClassroomStatusService } from '../services/classroomStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { StudentTeacherCommonServicesModule } from '../../../app/student-teacher-common-services.module';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MilestoneService } from '../services/milestoneService';
import { TeacherPeerGroupService } from '../services/teacherPeerGroupService';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MilestoneReportService } from '../services/milestoneReportService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ imports: [BrowserAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        StudentTeacherCommonServicesModule], providers: [
        ClassroomStatusService,
        MilestoneService,
        MilestoneReportService,
        TeacherDataService,
        TeacherPeerGroupService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ] })
export class ClassroomMonitorTestingModule {}
