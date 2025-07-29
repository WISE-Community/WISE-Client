import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../../services/notebookService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConceptMapContent } from '../ConceptMapContent';
import { EditConceptMapAdvancedComponent } from './edit-concept-map-advanced.component';

let component: EditConceptMapAdvancedComponent;
let fixture: ComponentFixture<EditConceptMapAdvancedComponent>;
let rule1: any;
describe('EditConceptMapAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConceptMapAdvancedComponent, StudentTeacherCommonServicesModule],
      providers: [
        TeacherNodeService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
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
