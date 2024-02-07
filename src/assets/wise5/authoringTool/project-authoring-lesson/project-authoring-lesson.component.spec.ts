import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringLessonComponent } from './project-authoring-lesson.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('ProjectAuthoringLessonComponent', () => {
  let component: ProjectAuthoringLessonComponent;
  let fixture: ComponentFixture<ProjectAuthoringLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeIconComponent, NodeIconAndTitleComponent, ProjectAuthoringLessonComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    });
    fixture = TestBed.createComponent(ProjectAuthoringLessonComponent);
    component = fixture.componentInstance;
    component.lesson = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
