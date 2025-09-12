import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { MockNodeService } from '../../common/MockNodeService';
import { SummaryAuthoring } from './summary-authoring.component';

let component: SummaryAuthoring;
let fixture: ComponentFixture<SummaryAuthoring>;
let getComponentSpy;
describe('SummaryAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SummaryAuthoring, StudentTeacherCommonServicesModule],
      providers: [
        { provide: TeacherNodeService, useClass: MockNodeService },
        ProjectAssetService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    fixture = TestBed.createComponent(SummaryAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.componentContent = copy(componentContent);
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    getComponentSpy = spyOn(projectService, 'getComponent');
    getComponentSpy.and.returnValue(componentContent);
    spyOn(component, 'componentChanged');
    fixture.detectChanges();
  });

  cCheckIfTheSummaryIsAllowedForAComponentType();
  checkThatTheComponentIdIsNotAutomaticallySetWhenNoComponents();
  checkThatTheComponentIdIsNotAutomaticallySetWhenMultipleComponents();
  checkThatTheComponentIdIsAutomaticallySet();
  checkIfStudentDataTypeIsAvailableForAComponentWhenTrue();
  checkIfStudentDataTypeIsAvailableForAComponentWhenFalse();
});

function createComponentContent() {
  return {
    id: '0ib10ikexr',
    type: 'Summary',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    summaryNodeId: 'node1',
    summaryComponentId: 'zptq1ndv4h',
    source: 'period',
    studentDataType: 'responses',
    chartType: 'column',
    requirementToSeeSummary: 'none',
    highlightCorrectAnswer: true,
    showAddToNotebookButton: true,
    showPromptFromOtherComponent: true,
    customLabelColors: []
  };
}

function cCheckIfTheSummaryIsAllowedForAComponentType() {
  it('should check if the summary is allowed for a component type', () => {
    expect(component.isComponentTypeAllowed('HTML')).toBeFalsy();
    expect(component.isComponentTypeAllowed('OutsideURL')).toBeFalsy();
    expect(component.isComponentTypeAllowed('Summary')).toBeFalsy();
    expect(component.isComponentTypeAllowed('Animation')).toBeTruthy();
    expect(component.isComponentTypeAllowed('AudioOscillator')).toBeTruthy();
    expect(component.isComponentTypeAllowed('ConceptMap')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Discussion')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Draw')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Embedded')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Graph')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Label')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Match')).toBeTruthy();
    expect(component.isComponentTypeAllowed('MultipleChoice')).toBeTruthy();
    expect(component.isComponentTypeAllowed('OpenResponse')).toBeTruthy();
    expect(component.isComponentTypeAllowed('Table')).toBeTruthy();
  });
}

function checkThatTheComponentIdIsNotAutomaticallySetWhenNoComponents() {
  it(`should check that the component id is not automatically set when the node id is changed if
  there are no allowed components`, () => {
    const components = [{ id: '4ty89q3hj0', type: 'HTML' }];
    expect(component.componentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponents').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.componentContent.summaryComponentId).toBe(null);
  });
}

function checkThatTheComponentIdIsNotAutomaticallySetWhenMultipleComponents() {
  it(`should check that the component id is not automatically set when the node id is changed if
  there are multiple allowed components`, () => {
    const components = [
      { id: '34j45u9w4j', type: 'OpenResponse' },
      { id: 'dghm45su45', type: 'MultipleChoice' }
    ];
    expect(component.componentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponents').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.componentContent.summaryComponentId).toBe(null);
  });
}

function checkThatTheComponentIdIsAutomaticallySet() {
  it(`should check that the component id is automatically set when the node id is changed if there
  is one allowed component`, () => {
    const components = [
      { id: '34j45u9w4j', type: 'HTML' },
      { id: 'dghm45su45', type: 'MultipleChoice' }
    ];
    expect(component.componentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponents').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.componentContent.summaryComponentId).toBe('dghm45su45');
  });
}

function checkIfStudentDataTypeIsAvailableForAComponentWhenTrue() {
  it('should check if student data type is available for a component when true', () => {
    const componentContent = {
      id: 'hxh43zj46j',
      prompt: 'This is hxh43zj46j',
      type: 'Embedded'
    };
    getComponentSpy.and.returnValue(componentContent);
    const isAvailable = component.isStudentDataTypeAvailableForComponent(
      'node1',
      'hxh43zj46j',
      'scores'
    );
    expect(isAvailable).toBeTruthy();
  });
}

function checkIfStudentDataTypeIsAvailableForAComponentWhenFalse() {
  it('should check if student data type is available for a component when false', () => {
    const componentContent = {
      id: 'hxh43zj46j',
      prompt: 'This is hxh43zj46j',
      type: 'Embedded'
    };
    getComponentSpy.and.returnValue(componentContent);
    const isAvailable = component.isStudentDataTypeAvailableForComponent(
      'node1',
      'hxh43zj46j',
      'responses'
    );
    expect(isAvailable).toBeFalsy();
  });
}
