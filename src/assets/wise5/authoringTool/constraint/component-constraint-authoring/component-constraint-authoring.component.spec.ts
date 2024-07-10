import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Constraint } from '../../../../../app/domain/constraint';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ComponentConstraintAuthoringComponent } from './component-constraint-authoring.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: ComponentConstraintAuthoringComponent;
let fixture: ComponentFixture<ComponentConstraintAuthoringComponent>;
const nodeId1 = 'node1';

describe('ComponentConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ComponentConstraintAuthoringComponent,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentConstraintAuthoringComponent);
    component = fixture.componentInstance;
    component.constraint = new Constraint({
      id: 'node1Constraint1',
      action: '',
      removalConditional: 'any',
      removalCriteria: [
        {
          name: '',
          params: {}
        }
      ]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1
    ]);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: nodeId1
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
