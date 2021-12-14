import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../../../services/achievementService';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentStatusService } from '../../../../services/studentStatusService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { UtilService } from '../../../../services/utilService';

import { NodeAdvancedConstraintAuthoringComponent } from './node-advanced-constraint-authoring.component';

describe('NodeAdvancedConstraintAuthoringComponent', () => {
  let component: NodeAdvancedConstraintAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedConstraintAuthoringComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatFormFieldModule, MatIconModule, UpgradeModule],
      declarations: [NodeAdvancedConstraintAuthoringComponent],
      providers: [
        AchievementService,
        AnnotationService,
        ConfigService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentDataService,
        StudentStatusService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
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
    it('should add a constraint', () => {
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
      function setRemovalCriteriaName(name: string): any {
        component.addConstraint();
        const constraint = component.node.constraints[0];
        const criteria = constraint.removalCriteria[0];
        criteria.name = name;
        component.removalCriteriaNameChanged(criteria);
        return criteria;
      }

      it('should handle removal criteria name changed to isCompleted', () => {
        const criteria = setRemovalCriteriaName('isCompleted');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
      });

      it('should handle removal criteria name changed to score', () => {
        const criteria = setRemovalCriteriaName('score');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
        expect(criteria.params['scores']).toEqual('');
      });

      it('should handle removal criteria name changed to branch path taken', () => {
        const criteria = setRemovalCriteriaName('branchPathTaken');
        expect(criteria.params['fromNodeId']).toEqual('');
        expect(criteria.params['toNodeId']).toEqual('');
      });

      it('should handle removal criteria name changed to choiceChosen', () => {
        const criteria = setRemovalCriteriaName('choiceChosen');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
        expect(criteria.params['choiceIds']).toEqual('');
      });

      it('should handle removal criteria name changed to isCorrect', () => {
        const criteria = setRemovalCriteriaName('isCorrect');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
      });

      it('should handle removal criteria name changed to usedXSubmits', () => {
        const criteria = setRemovalCriteriaName('usedXSubmits');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
        expect(criteria.params['requiredSubmitCount']).toEqual('');
      });

      it('should handle removal criteria name changed to isVisible', () => {
        const criteria = setRemovalCriteriaName('isVisible');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
      });

      it('should handle removal criteria name changed to isVisitable', () => {
        const criteria = setRemovalCriteriaName('isVisitable');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
      });

      it('should handle removal criteria name changed to isVisited', () => {
        const criteria = setRemovalCriteriaName('isVisited');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
      });

      it('should handle removal criteria name changed to wroteXNumberOfWords', () => {
        const criteria = setRemovalCriteriaName('wroteXNumberOfWords');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
        expect(criteria.params['requiredNumberOfWords']).toEqual('');
      });

      it('should handle removal criteria name changed to addXNumberOfNotesOnThisStep', () => {
        const criteria = setRemovalCriteriaName('addXNumberOfNotesOnThisStep');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['requiredNumberOfNotes']).toEqual('');
      });

      it('should handle removal criteria name changed to fillXNumberOfRows', () => {
        const criteria = setRemovalCriteriaName('fillXNumberOfRows');
        expect(criteria.params['nodeId']).toEqual(nodeId1);
        expect(criteria.params['componentId']).toEqual('');
        expect(criteria.params['requiredNumberOfFilledRows']).toEqual(null);
        expect(criteria.params['tableHasHeaderRow']).toEqual(true);
        expect(criteria.params['requireAllCellsInARowToBeFilled']).toEqual(true);
      });

      it('should handle removal criteria name changed to teacherRemoval', () => {
        const criteria = setRemovalCriteriaName('teacherRemoval');
        expect(criteria.params['nodeId']).toBeUndefined();
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
