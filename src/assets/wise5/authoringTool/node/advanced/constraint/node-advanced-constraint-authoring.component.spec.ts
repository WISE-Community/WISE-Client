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

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  let component: NodeAdvancedConstraintAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;
  const nodeId1 = 'node1';

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

  function addConstraint() {
    it('should add a constraint', () => {
      expect(component.node.constraints.length).toEqual(0);
      component.addConstraint();
      expect(component.node.constraints.length).toEqual(1);
    });
  }

  function deleteConstraint() {
    it('should delete a constraint', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.addConstraint();
      expect(component.node.constraints.length).toEqual(1);
      component.deleteConstraint(0);
      expect(component.node.constraints.length).toEqual(0);
    });
  }

  function addRemovalCriteria() {
    it('should add a removal criteria', () => {
      component.addConstraint();
      const constraint = component.node.constraints[0];
      expect(constraint.removalCriteria.length).toEqual(1);
      expect(component.addRemovalCriteria(constraint));
      expect(constraint.removalCriteria.length).toEqual(2);
    });
  }

  function removalCriteriaNameChanged() {
    describe('removalCriteriaNameChanged', () => {
      let removalCriteria;
      function setRemovalCriteriaName(name: string): any {
        component.addConstraint();
        removalCriteria = component.node.constraints[0].removalCriteria[0];
        removalCriteria.name = name;
        component.removalCriteriaNameChanged(removalCriteria);
      }

      function expectEmptyRemovalCriterialParamValue(...paramNames: string[]) {
        paramNames.forEach((paramName) => {
          expect(removalCriteria.params[paramName]).toEqual('');
        });
      }

      function expectRemovalCriteriaNodeIdValueToEqualNode1() {
        expect(removalCriteria.params['nodeId']).toEqual(nodeId1);
      }

      it('should handle removal criteria name changed to isCompleted', () => {
        setRemovalCriteriaName('isCompleted');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
      });

      it('should handle removal criteria name changed to score', () => {
        setRemovalCriteriaName('score');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId', 'scores');
      });

      it('should handle removal criteria name changed to branch path taken', () => {
        setRemovalCriteriaName('branchPathTaken');
        expectEmptyRemovalCriterialParamValue('fromNodeId', 'toNodeId');
      });

      it('should handle removal criteria name changed to choiceChosen', () => {
        setRemovalCriteriaName('choiceChosen');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId', 'choiceIds');
      });

      it('should handle removal criteria name changed to isCorrect', () => {
        setRemovalCriteriaName('isCorrect');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId');
      });

      it('should handle removal criteria name changed to usedXSubmits', () => {
        setRemovalCriteriaName('usedXSubmits');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId', 'requiredSubmitCount');
      });

      it('should handle removal criteria name changed to isVisible', () => {
        setRemovalCriteriaName('isVisible');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
      });

      it('should handle removal criteria name changed to isVisitable', () => {
        setRemovalCriteriaName('isVisitable');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
      });

      it('should handle removal criteria name changed to isVisited', () => {
        setRemovalCriteriaName('isVisited');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
      });

      it('should handle removal criteria name changed to wroteXNumberOfWords', () => {
        setRemovalCriteriaName('wroteXNumberOfWords');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId', 'requiredNumberOfWords');
      });

      it('should handle removal criteria name changed to addXNumberOfNotesOnThisStep', () => {
        setRemovalCriteriaName('addXNumberOfNotesOnThisStep');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('requiredNumberOfNotes');
      });

      it('should handle removal criteria name changed to fillXNumberOfRows', () => {
        setRemovalCriteriaName('fillXNumberOfRows');
        expectRemovalCriteriaNodeIdValueToEqualNode1();
        expectEmptyRemovalCriterialParamValue('componentId');
        expect(removalCriteria.params['requiredNumberOfFilledRows']).toEqual(null);
        expect(removalCriteria.params['tableHasHeaderRow']).toEqual(true);
        expect(removalCriteria.params['requireAllCellsInARowToBeFilled']).toEqual(true);
      });

      it('should handle removal criteria name changed to teacherRemoval', () => {
        setRemovalCriteriaName('teacherRemoval');
        expect(removalCriteria.params['nodeId']).toBeUndefined();
      });
    });
  }

  function deleteRemovalCriteria() {
    it('should delete removal criteria', () => {
      component.addConstraint();
      const constraint = component.node.constraints[0];
      expect(constraint.removalCriteria.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteRemovalCriteria(constraint, 0);
      expect(constraint.removalCriteria.length).toEqual(0);
    });
  }

  function getNewNodeContraintId() {
    it('should get new node constraint id when there are no existing constraints', () => {
      const constraintId = component.getNewNodeConstraintId(nodeId1);
      expect(constraintId).toEqual(`${nodeId1}Constraint1`);
    });

    it('should get new node constraint id when there are existing constraints', () => {
      component.addConstraint();
      const constraintId = component.getNewNodeConstraintId(nodeId1);
      expect(constraintId).toEqual(`${nodeId1}Constraint2`);
    });
  }

  addConstraint();
  deleteConstraint();
  addRemovalCriteria();
  removalCriteriaNameChanged();
  deleteRemovalCriteria();
  getNewNodeContraintId();
});
