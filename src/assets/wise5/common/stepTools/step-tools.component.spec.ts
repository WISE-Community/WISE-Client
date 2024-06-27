import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeService } from '../../services/nodeService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { StepToolsComponent } from './step-tools.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StepTools', () => {
  let component: StepToolsComponent;
  let fixture: ComponentFixture<StepToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        StepToolsComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        NodeService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    });
    fixture = TestBed.createComponent(StepToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
