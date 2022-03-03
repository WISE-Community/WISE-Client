import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { Observable, Subject } from 'rxjs';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { SummaryService } from '../summaryService';
import { SummaryAuthoring } from './summary-authoring.component';

export class MockConfigService {}

export class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
}

let component: SummaryAuthoring;
let fixture: ComponentFixture<SummaryAuthoring>;
let getComponentByNodeIdAndComponentIdSpy;

describe('SummaryAuthoring', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [EditComponentPrompt, SummaryAuthoring],
      providers: [
        AnnotationService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        StudentDataService,
        SummaryService,
        TagService,
        TeacherProjectService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    getComponentByNodeIdAndComponentIdSpy = spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    );
    getComponentByNodeIdAndComponentIdSpy.and.returnValue(componentContent);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponentService').and.returnValue({
      componentHasCorrectAnswer: () => {
        return true;
      }
    });
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
    expect(component.authoringComponentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponentsByNodeId').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.authoringComponentContent.summaryComponentId).toBe(null);
  });
}

function checkThatTheComponentIdIsNotAutomaticallySetWhenMultipleComponents() {
  it(`should check that the component id is not automatically set when the node id is changed if
  there are multiple allowed components`, () => {
    const components = [
      { id: '34j45u9w4j', type: 'OpenResponse' },
      { id: 'dghm45su45', type: 'MultipleChoice' }
    ];
    expect(component.authoringComponentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponentsByNodeId').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.authoringComponentContent.summaryComponentId).toBe(null);
  });
}

function checkThatTheComponentIdIsAutomaticallySet() {
  it(`should check that the component id is automatically set when the node id is changed if there
  is one allowed component`, () => {
    const components = [
      { id: '34j45u9w4j', type: 'HTML' },
      { id: 'dghm45su45', type: 'MultipleChoice' }
    ];
    expect(component.authoringComponentContent.summaryComponentId).toEqual('zptq1ndv4h');
    spyOn(component, 'getComponentsByNodeId').and.returnValue(components);
    component.summaryNodeIdChanged();
    expect(component.authoringComponentContent.summaryComponentId).toBe('dghm45su45');
  });
}

function checkIfStudentDataTypeIsAvailableForAComponentWhenTrue() {
  it('should check if student data type is available for a component when true', () => {
    const componentContent = {
      id: 'hxh43zj46j',
      prompt: 'This is hxh43zj46j',
      type: 'OpenResponse'
    };
    getComponentByNodeIdAndComponentIdSpy.and.returnValue(componentContent);
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
      type: 'OpenResponse'
    };
    getComponentByNodeIdAndComponentIdSpy.and.returnValue(componentContent);
    const isAvailable = component.isStudentDataTypeAvailableForComponent(
      'node1',
      'hxh43zj46j',
      'responses'
    );
    expect(isAvailable).toBeFalsy();
  });
}
