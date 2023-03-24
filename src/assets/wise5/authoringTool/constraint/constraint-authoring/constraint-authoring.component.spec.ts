import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { ConstraintAuthoringComponent } from './constraint-authoring.component';

let component: ConstraintAuthoringComponent;
let fixture: ComponentFixture<ConstraintAuthoringComponent>;
const nodeId1 = 'node1';

describe('ConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstraintAuthoringComponent, RequiredErrorLabelComponent],
      imports: [
        BrowserAnimationsModule,
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

    fixture = TestBed.createComponent(ConstraintAuthoringComponent);
    component = fixture.componentInstance;
    component.constraint = {
      id: 'node1Constraint1',
      action: '',
      targetId: nodeId1,
      removalConditional: 'any',
      removalCriteria: [
        {
          name: '',
          params: {}
        }
      ]
    };
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1
    ]);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      id: nodeId1
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    fixture.detectChanges();
  });

  addRemovalCriteria();
  removalCriteriaNameChanged();
  deleteRemovalCriteria();
});

function addRemovalCriteria() {
  describe('addRemovalCriteria', () => {
    it('should add a removal criteria', () => {
      const constraint = component.constraint;
      expect(constraint.removalCriteria.length).toEqual(1);
      expect(component.addRemovalCriteria(constraint));
      expect(constraint.removalCriteria.length).toEqual(2);
    });
  });
}

function removalCriteriaNameChanged() {
  describe('removalCriteriaNameChanged', () => {
    let removalCriteria: any;

    function setRemovalCriteriaName(name: string): any {
      removalCriteria = component.constraint.removalCriteria[0];
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
  describe('deleteRemovalCriteria', () => {
    it('should delete removal criteria', () => {
      const constraint = component.constraint;
      expect(constraint.removalCriteria.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteRemovalCriteria(constraint, 0);
      expect(constraint.removalCriteria.length).toEqual(0);
    });
  });
}
