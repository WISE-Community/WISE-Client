import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConceptMapContent } from '../ConceptMapContent';
import { EditConceptMapAdvancedComponent } from './edit-concept-map-advanced.component';

let component: EditConceptMapAdvancedComponent;
let fixture: ComponentFixture<EditConceptMapAdvancedComponent>;
let rule1: any;

describe('EditConceptMapAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [
        EditCommonAdvancedComponent,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentJsonComponent,
        EditComponentMaxScoreComponent,
        EditComponentRubricComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentTagsComponent,
        EditComponentWidthComponent,
        EditConceptMapAdvancedComponent,
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsComponent
      ],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue({
      rules: []
    } as ConceptMapContent);
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(true);
    fixture = TestBed.createComponent(EditConceptMapAdvancedComponent);
    component = fixture.componentInstance;
    rule1 = createRuleObject([], 'exactly', 'energy', 'A energy B', 'A', false, 1, 'B', 'link');
    spyOn(component, 'setShowSubmitButtonValue').and.callFake(() => {});
    spyOn(component, 'componentChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  ruleTypeChanged();
  addRule();
  ruleDeleteButtonClicked();
  addCategoryToRule();
  deleteCategoryFromRule();
});

function createRuleObject(
  categories: string[],
  comparison: string,
  linkLabel: string,
  name: string,
  nodeLabel: string,
  not: boolean,
  number: number,
  otherNodeLabel: string,
  type: string
): any {
  return {
    categories: categories,
    comparison: comparison,
    linkLabel: linkLabel,
    name: name,
    nodeLabel: nodeLabel,
    not: not,
    number: number,
    otherNodeLabel: otherNodeLabel,
    type: type
  };
}

function ruleTypeChanged() {
  describe('ruleTypeChanged', () => {
    it('should handle rule type changed to node', () => {
      component.componentContent.rules = [rule1];
      rule1.type = 'node';
      component.ruleTypeChanged(0);
      expect(rule1.linkLabel).toBeUndefined();
      expect(rule1.otherNodeLabel).toBeUndefined();
    });
  });
}

function addRule() {
  describe('addRule', () => {
    it('should add a rule', () => {
      expect(component.componentContent.rules.length).toEqual(0);
      component.addRule();
      expect(component.componentContent.rules.length).toEqual(1);
    });
  });
}

function ruleDeleteButtonClicked() {
  describe('ruleDeleteButtonClicked', () => {
    it('should delete a rule', () => {
      component.componentContent.rules = [rule1];
      spyOn(window, 'confirm').and.returnValue(true);
      component.ruleDeleteButtonClicked(0);
      expect(component.componentContent.rules.length).toEqual(0);
    });
  });
}

function addCategoryToRule() {
  describe('addCategoryToRule', () => {
    it('should add category to rule', () => {
      expect(rule1.categories.length).toEqual(0);
      component.addCategoryToRule(rule1);
      expect(rule1.categories.length).toEqual(1);
    });
  });
}

function deleteCategoryFromRule() {
  describe('deleteCategoryFromRule', () => {
    it('should delete a category from a rule', () => {
      rule1.categories = ['Computer'];
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteCategoryFromRule(rule1, 0);
      expect(rule1.categories.length).toEqual(0);
    });
  });
}
