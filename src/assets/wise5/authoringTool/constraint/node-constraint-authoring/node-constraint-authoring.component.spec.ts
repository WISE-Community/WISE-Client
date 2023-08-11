import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Constraint } from '../../../../../app/domain/constraint';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { NodeConstraintAuthoringComponent } from './node-constraint-authoring.component';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: NodeConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeConstraintAuthoringComponent>;

describe('NodeConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeConstraintAuthoringComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NodeConstraintAuthoringComponent);
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
    fixture.detectChanges();
  });

  addRemovalCriteria();
});

function addRemovalCriteria() {
  describe('addRemovalCriteria()', () => {
    it('should add a removal criteria', () => {
      const constraint = component.constraint;
      expect(constraint.removalCriteria.length).toEqual(1);
      expect(component.addRemovalCriteria(constraint));
      expect(constraint.removalCriteria.length).toEqual(2);
    });
  });
}
