import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringComponent } from './project-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CopyNodesService } from '../../services/copyNodesService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { MoveNodesService } from '../../services/moveNodesService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { ConcurrentAuthorsMessageComponent } from '../concurrent-authors-message/concurrent-authors-message.component';
import { NodeAuthoringComponent } from '../node/node-authoring/node-authoring.component';
import { TeacherNodeIconComponent } from '../teacher-node-icon/teacher-node-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProjectAuthoringComponent', () => {
  let component: ProjectAuthoringComponent;
  let fixture: ComponentFixture<ProjectAuthoringComponent>;
  let projectService: TeacherProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConcurrentAuthorsMessageComponent,
        NodeAuthoringComponent,
        ProjectAuthoringComponent,
        TeacherNodeIconComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        CopyNodesService,
        DeleteNodeService,
        MoveNodesService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'parseProject').and.callFake(() => {});
    spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue(['node1']);
    spyOn(projectService, 'getNodeById').and.returnValue({ title: 'Step 1' });
    spyOn(projectService, 'getInactiveNodes').and.returnValue([]);
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(ProjectAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
