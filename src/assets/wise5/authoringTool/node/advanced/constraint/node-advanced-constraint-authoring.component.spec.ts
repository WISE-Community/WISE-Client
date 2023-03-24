// @ts-nocheck
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AchievementService } from '../../../../services/achievementService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';

let component: NodeAdvancedConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;
const nodeId1 = 'node1';

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [NodeAdvancedConstraintAuthoringComponent],
      providers: [
        AchievementService,
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedConstraintAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue(
      []
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: 'node1',
      constraints: []
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    fixture.detectChanges();
  });

  addConstraint();
  deleteConstraint();
  getNewNodeContraintId();
});

function addConstraint() {
  describe('addConstraint', () => {
    it('should add a constraint', () => {
      expect(component.node.constraints.length).toEqual(0);
      component.addConstraint();
      expect(component.node.constraints.length).toEqual(1);
    });
  });
}

function deleteConstraint() {
  describe('deleteConstraint', () => {
    it('should delete a constraint', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.addConstraint();
      expect(component.node.constraints.length).toEqual(1);
      component.deleteConstraint(0);
      expect(component.node.constraints.length).toEqual(0);
    });
  });
}

function getNewNodeContraintId() {
  describe('getNewNodeContraintId', () => {
    it('should get new node constraint id when there are no existing constraints', () => {
      const constraintId = component.getNewNodeConstraintId(nodeId1);
      expect(constraintId).toEqual(`${nodeId1}Constraint1`);
    });

    it('should get new node constraint id when there are existing constraints', () => {
      component.addConstraint();
      const constraintId = component.getNewNodeConstraintId(nodeId1);
      expect(constraintId).toEqual(`${nodeId1}Constraint2`);
    });
  });
}
