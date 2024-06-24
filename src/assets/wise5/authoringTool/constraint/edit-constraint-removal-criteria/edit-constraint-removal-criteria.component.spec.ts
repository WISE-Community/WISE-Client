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
import { ComponentContent } from '../../../common/ComponentContent';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

let component: EditConstraintRemovalCriteriaComponent;
const componentId1: string = 'component1';
const componentId2: string = 'component2';
const componentId3: string = 'component3';
const componentId4: string = 'component4';
const componentId5: string = 'component5';
const componentId6: string = 'component6';
const componentTypeMultipleChoice: string = 'MultipleChoice';
const componentTypeOpenResponse: string = 'OpenResponse';
const componentTypeTable: string = 'Table';
let fixture: ComponentFixture<EditConstraintRemovalCriteriaComponent>;
const nodeId1: string = 'node1';
const nodeId2: string = 'node2';
const nodeId3: string = 'node3';
let removalCriteria: any;

// TODO- use component harness
xdescribe('EditConstraintRemovalCriteriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EditConstraintRemovalCriteriaComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();

    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1,
      nodeId2,
      nodeId3
    ]);
    TestBed.inject(TeacherProjectService).idToNode = {
      node1: createNode(nodeId1, [
        createComponent(componentId1, componentTypeMultipleChoice),
        createComponent(componentId2, componentTypeOpenResponse),
        createComponent(componentId3, componentTypeTable)
      ]),
      node2: createNode(nodeId2, [
        createComponent(componentId4, componentTypeMultipleChoice),
        createComponent(componentId5, componentTypeMultipleChoice)
      ]),
      node3: createNode(nodeId3, [createComponent(componentId6, componentTypeOpenResponse)])
    };
    fixture = TestBed.createComponent(EditConstraintRemovalCriteriaComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    removalCriteria = {
      name: '',
      params: {}
    };
    component.criteria = removalCriteria;
    component.constraint = new Constraint({
      id: 'node1Constraint1',
      action: '',
      removalConditional: 'any',
      removalCriteria: [removalCriteria]
    });
    component.node = { id: 'node1' };
    fixture.detectChanges();
  });

  deleteRemovalCriteria();
  nameChanged();
});

function createNode(id: string, components: any[]): any {
  return { id, components };
}

function createComponent(id: string, type: string): ComponentContent {
  return { id, type };
}

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
  choiceChosen_StepsWithAndWithoutMultipleChoice_ShouldOnlyShowStepsWithMultipleChoice();
  choiceChosen_StepWithAndWithoutMultipleChoice_ShouldOnlyShowMultipleChoiceComponents();
  choiceChosen_WithOneMultipleChoiceComponent_ShouldAutomaticallySelect();
  choiceChosen_WithTwoMultipleChoiceComponents_ShouldNotAutomaticallySelect();
}

function choiceChosen_StepsWithAndWithoutMultipleChoice_ShouldOnlyShowStepsWithMultipleChoice() {
  describe('there are steps with and without Multiple Choice components', () => {
    it('should only show the steps with Multiple Choice components', () => {
      chooseSelectOptionByLabel('Removal Criteria Name', 'Choice Chosen');
      clickSelectElement('Step');
      expectOptions(['', nodeId1, nodeId2]);
    });
  });
}

function choiceChosen_StepWithAndWithoutMultipleChoice_ShouldOnlyShowMultipleChoiceComponents() {
  describe('choose a step with and without Multiple Choice components', () => {
    it('should only show the Multiple Choice components', () => {
      chooseSelectOptionByLabel('Removal Criteria Name', 'Choice Chosen');
      chooseSelectOptionByValue('Step', nodeId1);
      clickSelectElement('Component');
      expectOptions(['', componentId1]);
    });
  });
}

function choiceChosen_WithOneMultipleChoiceComponent_ShouldAutomaticallySelect() {
  describe('choose step with one Multiple Choice component', () => {
    it('should automatically select the one Multiple Choice component', () => {
      chooseSelectOptionByLabel('Removal Criteria Name', 'Choice Chosen');
      chooseSelectOptionByValue('Step', nodeId1);
      expectComponentIdToEqual(componentId1);
      expectEmptyRemovalCriterialParamValue('choiceIds');
    });
  });
}

function choiceChosen_WithTwoMultipleChoiceComponents_ShouldNotAutomaticallySelect() {
  describe('choose step with two Multiple Choice components', () => {
    it('should not automatically select a Multiple Choice compoennt', () => {
      chooseSelectOptionByLabel('Removal Criteria Name', 'Choice Chosen');
      chooseSelectOptionByValue('Step', nodeId2);
      expectComponentIdToEqual('');
      expectEmptyRemovalCriterialParamValue('choiceIds');
    });
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
    expectComponentIdToEqual(componentId2);
    expectEmptyRemovalCriterialParamValue('requiredNumberOfWords');
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
    expectComponentIdToEqual(componentId3);
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

function expectComponentIdToEqual(componentId: string): void {
  expect(removalCriteria.params['componentId']).toEqual(componentId);
}

function expectOptions(expectedOptionValues: string[]): void {
  const options = fixture.debugElement.queryAll(By.css('.mat-option'));
  options.forEach((option, index) => {
    expect(option.attributes['ng-reflect-value']).toEqual(expectedOptionValues[index]);
  });
}

function chooseSelectOptionByLabel(selectLabel: string, optionLabel: string): void {
  clickSelectElement(selectLabel);
  fixture.debugElement
    .queryAll(By.css('.mat-option'))
    .find((element) => element.nativeElement.textContent === optionLabel)
    .nativeElement.click();
  fixture.detectChanges();
}

function chooseSelectOptionByValue(selectLabel: string, optionValue: string): void {
  clickSelectElement(selectLabel);
  fixture.debugElement
    .query(By.css(`.mat-option[ng-reflect-value='${optionValue}']`))
    .nativeElement.click();
  fixture.detectChanges();
}

function clickSelectElement(label: string): void {
  getSelectElement(label).query(By.css('.mat-select-trigger')).nativeElement.click();
  fixture.detectChanges();
}

function getSelectElement(label: string): DebugElement {
  return fixture.debugElement
    .queryAll(By.css('.mat-form-field'))
    .find((element) =>
      element
        .queryAll(By.css('mat-label'))
        .find((matLabel) => matLabel.nativeElement.textContent === label)
    );
}
