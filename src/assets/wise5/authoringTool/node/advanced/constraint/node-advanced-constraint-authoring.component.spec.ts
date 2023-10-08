// @ts-nocheck
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { NodeAdvancedAuthoringComponent } from '../node-advanced-authoring/node-advanced-authoring.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

let component: NodeAdvancedConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [NodeAdvancedAuthoringComponent, NodeAdvancedConstraintAuthoringComponent],
      providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { parent: { params: of({ nodeId: 'node1' }) } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedConstraintAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: 'node1',
      constraints: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
