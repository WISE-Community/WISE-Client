import '../../../assets/wise5/lib/jquery/jquery-global';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentStudentModule } from '../../../assets/wise5/components/component/component-student.module';
import { GenerateImageDialogComponent } from '../../../assets/wise5/directives/generate-image-dialog/generate-image-dialog.component';
import { SimpleDialogModule } from '../../../assets/wise5/directives/simple-dialog.module';
import { SummaryDisplayModule } from '../../../assets/wise5/directives/summary-display/summary-display.module';
import { InitializeVLEService } from '../../../assets/wise5/services/initializeVLEService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { StudentAssetsDialogModule } from '../../../assets/wise5/vle/studentAsset/student-assets-dialog/student-assets-dialog.module';
import { VLEComponent } from '../../../assets/wise5/vle/vle.component';
import { VLEProjectService } from '../../../assets/wise5/vle/vleProjectService';
import { StudentTeacherCommonModule } from '../../student-teacher-common.module';
import { DataService } from '../../services/data.service';
import { StudentComponentModule } from '../student.component.module';
import { StudentVLERoutingModule } from './student-vle-routing.module';
import { PauseScreenService } from '../../../assets/wise5/services/pauseScreenService';
import { StudentNotificationService } from '../../../assets/wise5/services/studentNotificationService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { VLEParentComponent } from '../../../assets/wise5/vle/vle-parent/vle-parent.component';
import { StudentPeerGroupService } from '../../../assets/wise5/services/studentPeerGroupService';
import { PeerGroupService } from '../../../assets/wise5/services/peerGroupService';

@NgModule({
  declarations: [GenerateImageDialogComponent, VLEParentComponent],
  imports: [
    CommonModule,
    ComponentStudentModule,
    MatDialogModule,
    SimpleDialogModule,
    StudentAssetsDialogModule,
    StudentComponentModule,
    StudentTeacherCommonModule,
    StudentVLERoutingModule,
    SummaryDisplayModule,
    VLEComponent
  ],
  providers: [
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
