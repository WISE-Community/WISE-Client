import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringStepComponent } from './project-authoring-step.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherDataService } from '../../services/teacherDataService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const nodeId1 = 'nodeId1';
const node = { id: nodeId1 };

describe('ProjectAuthoringStepComponent', () => {
  let component: ProjectAuthoringStepComponent;
  let fixture: ComponentFixture<ProjectAuthoringStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAuthoringStepComponent],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        NodeIconAndTitleComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        CopyNodesService,
        CopyTranslationsService,
        DeleteNodeService,
        DeleteTranslationsService,
        provideRouter([]),
        TeacherDataService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    fixture = TestBed.createComponent(ProjectAuthoringStepComponent);
    component = fixture.componentInstance;
    component.step = node;
    const idToNode = {};
    idToNode[nodeId1] = node;
    const projectService = TestBed.inject(TeacherProjectService);
    projectService.idToNode = idToNode;
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
