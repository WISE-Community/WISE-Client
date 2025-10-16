import '../../../assets/wise5/lib/jquery/jquery-global';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentStudentModule } from '../../../assets/wise5/components/component/component-student.module';
import { InitializeVLEService } from '../../../assets/wise5/services/initializeVLEService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { VLEComponent } from '../../../assets/wise5/vle/vle.component';
import { VLEProjectService } from '../../../assets/wise5/vle/vleProjectService';
import { DataService } from '../../services/data.service';
import { StudentComponentModule } from '../student.component.module';
import { StudentVLERoutingModule } from './student-vle-routing.module';
import { PauseScreenService } from '../../../assets/wise5/services/pauseScreenService';
import { StudentNotificationService } from '../../../assets/wise5/services/studentNotificationService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { VLEParentComponent } from '../../../assets/wise5/vle/vle-parent/vle-parent.component';
import { StudentPeerGroupService } from '../../../assets/wise5/services/studentPeerGroupService';
import { PeerGroupService } from '../../../assets/wise5/services/peerGroupService';
import { StudentAssetsDialogComponent } from '../../../assets/wise5/vle/studentAsset/student-assets-dialog/student-assets-dialog.component';
import { GenerateImageService } from '../../../assets/wise5/services/generateImageService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentStudentModule,
    MatDialogModule,
    StudentAssetsDialogComponent,
    StudentComponentModule,
    StudentTeacherCommonServicesModule,
    StudentVLERoutingModule,
    VLEComponent,
    VLEParentComponent
  ],
  providers: [
    GenerateImageService,
    InitializeVLEService,
    PauseScreenService,
    { provide: DataService, useExisting: StudentDataService },
    { provide: NotificationService, useExisting: StudentNotificationService },
    { provide: PeerGroupService, useExisting: StudentPeerGroupService },
    { provide: ProjectService, useExisting: VLEProjectService },
    StudentNotificationService,
    VLEProjectService
  ]
})
export class StudentVLEModule {}
