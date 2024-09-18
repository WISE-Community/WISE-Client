import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringLessonComponent } from './project-authoring-lesson.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProjectAuthoringStepComponent } from '../project-authoring-step/project-authoring-step.component';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { MatMenuModule } from '@angular/material/menu';
import { AddStepButtonComponent } from '../add-step-button/add-step-button.component';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { RemoveNodeIdFromTransitionsService } from '../../services/removeNodeIdFromTransitionsService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let component: ProjectAuthoringLessonComponent;
let fixture: ComponentFixture<ProjectAuthoringLessonComponent>;
const groupId1 = 'group1';
const nodeId1 = 'node1';
const nodeId2 = 'node2';
let teacherProjectService: TeacherProjectService;

const group1 = {
  id: groupId1,
  type: 'group',
  title: 'Lesson 1',
  ids: [nodeId1, nodeId2],
  startId: nodeId1
};
const node1 = { id: nodeId1, title: 'Step 1' };
const node2 = { id: nodeId2, title: 'Step 2' };

describe('ProjectAuthoringLessonComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ProjectAuthoringLessonComponent, ProjectAuthoringStepComponent],
      imports: [
        AddStepButtonComponent,
        BrowserAnimationsModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
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
        RemoveNodeIdFromTransitionsService,
        TeacherDataService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    teacherProjectService.idToNode = {
      group1: group1,
      node1: node1,
      node2: node2
    };
    teacherProjectService.project = { nodes: [group1, node1, node2], startNodeId: nodeId1 };
    spyOn(teacherProjectService, 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(ProjectAuthoringLessonComponent);
    component = fixture.componentInstance;
    component.lesson = group1;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
