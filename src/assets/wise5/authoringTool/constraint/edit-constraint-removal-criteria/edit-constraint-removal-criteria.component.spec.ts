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
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { EditConstraintRemovalCriteriaComponent } from './edit-constraint-removal-criteria.component';

let component: EditConstraintRemovalCriteriaComponent;
let fixture: ComponentFixture<EditConstraintRemovalCriteriaComponent>;
let removalCriteria: any;

describe('EditConstraintRemovalCriteriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConstraintRemovalCriteriaComponent, RequiredErrorLabelComponent],
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
      providers: [TeacherProjectService]
    }).compileComponents();

    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1'
    ]);

    fixture = TestBed.createComponent(EditConstraintRemovalCriteriaComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    removalCriteria = [
      {
        name: '',
        params: {}
      }
    ];
    component.criteria = removalCriteria;
    component.constraint = new Constraint({
      id: 'node1Constraint1',
      action: '',
      removalConditional: 'any',
      removalCriteria: removalCriteria
    });
    component.node = { id: 'node1' };
    fixture.detectChanges();
  });

  deleteRemovalCriteria();
  nameChanged();
});

function deleteRemovalCriteria() {
  describe('deleteRemovalCriteria()', () => {
    it('should delete removal criteria', () => {
      expect(component.constraint.removalCriteria.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteRemovalCriteria();
      expect(component.constraint.removalCriteria.length).toEqual(0);
    });
  });
}

function nameChanged() {
  describe('nameChanged()', () => {
    nameChanged_IsCompleted();
    nameChanged_Score();
    nameChanged_BranchPathTaken();
    nameChanged_ChoiceChosen();
    nameChanged_IsCorrect();
    nameChanged_UsedXSubmits();
    nameChanged_IsVisible();
    nameChanged_IsVisitable();
    nameChanged_IsVisited();
    nameChanged_WroteXNumberWords();
    nameChanged_AddXNumberNotes();
    nameChanged_FillXNumberRows();
    nameChanged_TeacherRemoval();
  });
}

function nameChanged_IsCompleted() {
  it('should handle removal criteria name changed to isCompleted', () => {
    setRemovalCriteriaName('isCompleted');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function nameChanged_Score() {
  it('should handle removal criteria name changed to score', () => {
    setRemovalCriteriaName('score');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'scores');
  });
}

function nameChanged_BranchPathTaken() {
  it('should handle removal criteria name changed to branch path taken', () => {
    setRemovalCriteriaName('branchPathTaken');
    expectEmptyRemovalCriterialParamValue('fromNodeId', 'toNodeId');
  });
}

function nameChanged_ChoiceChosen() {
  it('should handle removal criteria name changed to choiceChosen', () => {
    setRemovalCriteriaName('choiceChosen');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'choiceIds');
  });
}

function nameChanged_IsCorrect() {
  it('should handle removal criteria name changed to isCorrect', () => {
    setRemovalCriteriaName('isCorrect');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId');
  });
}

function nameChanged_UsedXSubmits() {
  it('should handle removal criteria name changed to usedXSubmits', () => {
    setRemovalCriteriaName('usedXSubmits');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'requiredSubmitCount');
  });
}

function nameChanged_IsVisible() {
  it('should handle removal criteria name changed to isVisible', () => {
    setRemovalCriteriaName('isVisible');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function nameChanged_IsVisitable() {
  it('should handle removal criteria name changed to isVisitable', () => {
    setRemovalCriteriaName('isVisitable');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function nameChanged_IsVisited() {
  it('should handle removal criteria name changed to isVisited', () => {
    setRemovalCriteriaName('isVisited');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
  });
}

function nameChanged_WroteXNumberWords() {
  it('should handle removal criteria name changed to wroteXNumberOfWords', () => {
    setRemovalCriteriaName('wroteXNumberOfWords');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId', 'requiredNumberOfWords');
  });
}

function nameChanged_AddXNumberNotes() {
  it('should handle removal criteria name changed to addXNumberOfNotesOnThisStep', () => {
    setRemovalCriteriaName('addXNumberOfNotesOnThisStep');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('requiredNumberOfNotes');
  });
}

function nameChanged_FillXNumberRows() {
  it('should handle removal criteria name changed to fillXNumberOfRows', () => {
    setRemovalCriteriaName('fillXNumberOfRows');
    expectRemovalCriteriaNodeIdValueToEqualNode1();
    expectEmptyRemovalCriterialParamValue('componentId');
    expect(removalCriteria.params['requiredNumberOfFilledRows']).toEqual('');
    expect(removalCriteria.params['tableHasHeaderRow']).toEqual(true);
    expect(removalCriteria.params['requireAllCellsInARowToBeFilled']).toEqual(true);
  });
}

function nameChanged_TeacherRemoval() {
  it('should handle removal criteria name changed to teacherRemoval', () => {
    setRemovalCriteriaName('teacherRemoval');
    expect(removalCriteria.params['nodeId']).toBeUndefined();
  });
}

function setRemovalCriteriaName(name: string): any {
  removalCriteria = component.constraint.removalCriteria[0];
  removalCriteria.name = name;
  component.nameChanged(removalCriteria);
}

function expectEmptyRemovalCriterialParamValue(...paramNames: string[]): void {
  paramNames.forEach((paramName) => {
    expect(removalCriteria.params[paramName]).toEqual('');
  });
}

function expectRemovalCriteriaNodeIdValueToEqualNode1(): void {
  expect(removalCriteria.params['nodeId']).toEqual('node1');
}
