import '../../../assets/wise5/lib/jquery/jquery-global';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VLEParentComponent } from '../../../assets/wise5/vle/vle-parent/vle-parent.component';
import { VLEComponent } from '../../../assets/wise5/vle/vle.component';
import { GenerateImageService } from '../../../assets/wise5/services/generateImageService';
import { InitializeVLEService } from '../../../assets/wise5/services/initializeVLEService';
import { PauseScreenService } from '../../../assets/wise5/services/pauseScreenService';
import { ComponentStudentModule } from '../../../assets/wise5/components/component/component-student.module';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { VLEProjectService } from '../../../assets/wise5/vle/vleProjectService';
import { DataService } from '../../services/data.service';
import { StudentNotificationService } from '../../../assets/wise5/services/studentNotificationService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { StudentPeerGroupService } from '../../../assets/wise5/services/studentPeerGroupService';
import { PeerGroupService } from '../../../assets/wise5/services/peerGroupService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';

const routes: Routes = [
  {
    path: '',
    component: VLEParentComponent,
    children: [
      {
        path: ':nodeId',
        component: VLEComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ComponentStudentModule,
    StudentTeacherCommonServicesModule
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
export class StudentVLERoutingModule {}
