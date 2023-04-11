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
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { NodeConstraintAuthoringComponent } from './node-constraint-authoring.component';

let component: NodeConstraintAuthoringComponent;
let fixture: ComponentFixture<NodeConstraintAuthoringComponent>;
const nodeId1 = 'node1';
let removalCriteria: any;

describe('NodeConstraintAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeConstraintAuthoringComponent, RequiredErrorLabelComponent],
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
  describe('removalCriteriaNameChanged()', () => {
    removalCriteriaNameChangedIsCompleted();
    removalCriteriaNameChangedScore();
    removalCriteriaNameChangedBranchPathTaken();
    removalCriteriaNameChangedChoiceChosen();
    removalCriteriaNameChangedIsCorrect();
    removalCriteriaNameChangedUsedXSubmits();
    removalCriteriaNameChangedIsVisible();
    removalCriteriaNameChangedIsVisitable();
    removalCriteriaNameChangedIsVisited();
    removalCriteriaNameChangedWroteXNumberWords();
    removalCriteriaNameChangedAddXNumberNotes();
    removalCriteriaNameChangedFillXNumberRows();
    removalCriteriaNameChangedTeacherRemoval();
  });
}

function removalCriteriaNameChangedIsCompleted() {
  it('should handle removal criteria name changed to isCompleted', () => {
    setRemovalCriteriaName('isCompleted');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function removalCriteriaNameChangedScore() {
  it('should handle removal criteria name changed to score', () => {
    setRemovalCriteriaName('score');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'scores');
  });
}

function removalCriteriaNameChangedBranchPathTaken() {
  it('should handle removal criteria name changed to branch path taken', () => {
    setRemovalCriteriaName('branchPathTaken');
    expectEmptyRemovalCriterialParamValue('fromNodeId', 'toNodeId');
  });
}

function removalCriteriaNameChangedChoiceChosen() {
  it('should handle removal criteria name changed to choiceChosen', () => {
    setRemovalCriteriaName('choiceChosen');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'choiceIds');
  });
}

function removalCriteriaNameChangedIsCorrect() {
  it('should handle removal criteria name changed to isCorrect', () => {
    setRemovalCriteriaName('isCorrect');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId');
  });
}

function removalCriteriaNameChangedUsedXSubmits() {
  it('should handle removal criteria name changed to usedXSubmits', () => {
    setRemovalCriteriaName('usedXSubmits');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'requiredSubmitCount');
  });
}

function removalCriteriaNameChangedIsVisible() {
  it('should handle removal criteria name changed to isVisible', () => {
    setRemovalCriteriaName('isVisible');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function removalCriteriaNameChangedIsVisitable() {
  it('should handle removal criteria name changed to isVisitable', () => {
    setRemovalCriteriaName('isVisitable');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function removalCriteriaNameChangedIsVisited() {
  it('should handle removal criteria name changed to isVisited', () => {
    setRemovalCriteriaName('isVisited');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function removalCriteriaNameChangedWroteXNumberWords() {
  it('should handle removal criteria name changed to wroteXNumberOfWords', () => {
    setRemovalCriteriaName('wroteXNumberOfWords');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'requiredNumberOfWords');
  });
}

function removalCriteriaNameChangedAddXNumberNotes() {
  it('should handle removal criteria name changed to addXNumberOfNotesOnThisStep', () => {
    setRemovalCriteriaName('addXNumberOfNotesOnThisStep');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('requiredNumberOfNotes');
  });
}

function removalCriteriaNameChangedFillXNumberRows() {
  it('should handle removal criteria name changed to fillXNumberOfRows', () => {
    setRemovalCriteriaName('fillXNumberOfRows');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId');
    expect(removalCriteria.params['requiredNumberOfFilledRows']).toEqual('');
    expect(removalCriteria.params['tableHasHeaderRow']).toEqual(true);
    expect(removalCriteria.params['requireAllCellsInARowToBeFilled']).toEqual(true);
  });
}

function removalCriteriaNameChangedTeacherRemoval() {
  it('should handle removal criteria name changed to teacherRemoval', () => {
    setRemovalCriteriaName('teacherRemoval');
    expect(removalCriteria.params['nodeId']).toBeUndefined();
  });
}

function setRemovalCriteriaName(name: string): any {
  removalCriteria = component.constraint.removalCriteria[0];
  removalCriteria.name = name;
  component.removalCriteriaNameChanged(removalCriteria);
}

function expectEmptyRemovalCriterialParamValue(...paramNames: string[]): void {
  paramNames.forEach((paramName) => {
    expect(removalCriteria.params[paramName]).toEqual('');
  });
}

function expectRemovalCriteriaNodeIdValueToEqualNode1(): void {
  expect(removalCriteria.params['nodeId']).toEqual(nodeId1);
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
