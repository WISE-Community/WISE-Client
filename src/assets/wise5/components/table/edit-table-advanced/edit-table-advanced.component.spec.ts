import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
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
import { ComponentContent } from '../../../common/ComponentContent';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditTableConnectedComponentsComponent } from '../edit-table-connected-components/edit-table-connected-components.component';
import { EditTableAdvancedComponent } from './edit-table-advanced.component';

let component: EditTableAdvancedComponent;
let fixture: ComponentFixture<EditTableAdvancedComponent>;

describe('EditTableAdvancedComponent', () => {
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
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [
        EditComponentAddToNotebookButtonComponent,
        EditCommonAdvancedComponent,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentJsonComponent,
        EditComponentMaxScoreComponent,
        EditComponentRubricComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentTagsComponent,
        EditComponentWidthComponent,
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsComponent,
        EditTableAdvancedComponent,
        EditTableConnectedComponentsComponent
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(createComponent());
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1',
      'node2',
      'node3'
    ]);
    fixture = TestBed.createComponent(EditTableAdvancedComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setShowSubmitButtonValue').and.callFake(() => {});
    spyOn(component, 'componentChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  shouldToggleDataExplorer();
  shouldToggleDataExplorerScatterPlot();
  shouldToggleDataExplorerLineGraph();
  shouldToggleDataExplorerBarGraph();
  shouldToggleDataExplorerGraphType();
  shouldCreateGraphTypeObject();
  shouldInitializeDataExplorerGraphTypes();
  shouldRepopulateDataExplorerGraphTypes();
  shouldInitializeDataExplorerSeriesParams();
  shouldHandleNumDataExplorerSeriesChangeIncrease();
  shouldHandleNumDataExplorerSeriesChangeDecrease();
  shouldIncreaseNumDataExplorerSeries();
  shouldDecreaseNumDataExplorerSeries();
  shouldUpdateDataExplorerSeriesParamsYAxis();
});

function createComponent() {
  return {
    id: '9dbz79h8ge',
    nodeId: 'node1',
    rubric: 'rubric text',
    type: 'Table',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    tableData: [
      [
        {
          text: 'Student ID',
          editable: true,
          size: null
        },
        {
          text: 'Grade',
          editable: true,
          size: null
        }
      ],
      [
        {
          text: '1',
          editable: true,
          size: null
        },
        {
          text: '90',
          editable: true,
          size: null
        }
      ],
      [
        {
          text: '2',
          editable: true,
          size: null
        },
        {
          text: '80',
          editable: true,
          size: null
        }
      ]
    ],
    isDataExplorerEnabled: true,
    dataExplorerGraphTypes: [
      {
        name: 'Scatter Plot',
        value: 'scatter'
      },
      {
        name: 'Bar Graph',
        value: 'column'
      }
    ],
    numDataExplorerSeries: 1,
    isDataExplorerAxisLabelsEditable: false,
    isDataExplorerScatterPlotRegressionLineEnabled: true
  } as ComponentContent;
}

function shouldToggleDataExplorer() {
  it('should toggle data explorer', () => {
    component.authoringComponentContent.isDataExplorerEnabled = true;
    component.authoringComponentContent.dataExplorerGraphTypes = null;
    component.authoringComponentContent.numDataExplorerSeries = null;
    component.authoringComponentContent.isDataExplorerAxisLabelsEditable = null;
    component.authoringComponentContent.dataExplorerDataToColumn = null;
    component.toggleDataExplorer();
    const authoringComponentContent = component.authoringComponentContent;
    expect(authoringComponentContent.isDataExplorerEnabled).toEqual(true);
    expect(authoringComponentContent.dataExplorerGraphTypes.length).toEqual(1);
    expect(authoringComponentContent.dataExplorerGraphTypes[0].value).toEqual('scatter');
    expect(authoringComponentContent.numDataExplorerSeries).toEqual(1);
    expect(authoringComponentContent.isDataExplorerAxisLabelsEditable).toEqual(false);
    expect(authoringComponentContent.isDataExplorerAxisLabelsEditable).toEqual(false);
    expect(authoringComponentContent.dataExplorerSeriesParams).toEqual([{}]);
    expect(authoringComponentContent.dataExplorerDataToColumn).toEqual({});
  });
}

function shouldToggleDataExplorerScatterPlot() {
  it('should toggle data explorer scatter plot', () => {
    const dataExplorerGraphTypes = component.authoringComponentContent.dataExplorerGraphTypes;
    expect(dataExplorerGraphTypes.length).toEqual(2);
    expect(dataExplorerGraphTypes[0].value).toEqual('scatter');
    expect(dataExplorerGraphTypes[1].value).toEqual('column');
    component.dataExplorerToggleScatterPlot();
    expect(dataExplorerGraphTypes.length).toEqual(1);
    expect(dataExplorerGraphTypes[0].value).toEqual('column');
  });
}

function shouldToggleDataExplorerLineGraph() {
  it('should toggle data explorer line graph', () => {
    const dataExplorerGraphTypes = component.authoringComponentContent.dataExplorerGraphTypes;
    expect(dataExplorerGraphTypes.length).toEqual(2);
    expect(dataExplorerGraphTypes[0].value).toEqual('scatter');
    expect(dataExplorerGraphTypes[1].value).toEqual('column');
    component.dataExplorerToggleLineGraph();
    expect(dataExplorerGraphTypes.length).toEqual(3);
    expect(dataExplorerGraphTypes[2].value).toEqual('line');
  });
}

function shouldToggleDataExplorerBarGraph() {
  it('should toggle data explorer bar graph', () => {
    const dataExplorerGraphTypes = component.authoringComponentContent.dataExplorerGraphTypes;
    expect(dataExplorerGraphTypes.length).toEqual(2);
    expect(dataExplorerGraphTypes[0].value).toEqual('scatter');
    expect(dataExplorerGraphTypes[1].value).toEqual('column');
    component.dataExplorerToggleBarGraph();
    expect(dataExplorerGraphTypes.length).toEqual(1);
    expect(dataExplorerGraphTypes[0].value).toEqual('scatter');
  });
}

function shouldToggleDataExplorerGraphType() {
  it('should toggle data explorer graph type', () => {
    const dataExplorerGraphTypes = component.authoringComponentContent.dataExplorerGraphTypes;
    expect(dataExplorerGraphTypes.length).toEqual(2);
    component.dataExplorerToggleGraphType('Hello', 'World');
    expect(dataExplorerGraphTypes.length).toEqual(3);
    expect(dataExplorerGraphTypes[2].name).toEqual('Hello');
    expect(dataExplorerGraphTypes[2].value).toEqual('World');
  });
}

function shouldCreateGraphTypeObject() {
  it('should create graph type object', () => {
    const graphTypeObject = component.createGraphTypeObject('Hello', 'World');
    expect(graphTypeObject.name).toEqual('Hello');
    expect(graphTypeObject.value).toEqual('World');
  });
}

function shouldInitializeDataExplorerGraphTypes() {
  it('should initialize data explorer graph types', () => {
    component.authoringComponentContent.dataExplorerGraphTypes = [];
    component.initializeDataExplorerGraphTypes();
    const dataExplorerGraphTypes = component.authoringComponentContent.dataExplorerGraphTypes;
    expect(dataExplorerGraphTypes.length).toEqual(1);
    expect(dataExplorerGraphTypes[0].name).toEqual('Scatter Plot');
    expect(dataExplorerGraphTypes[0].value).toEqual('scatter');
  });
}

function shouldRepopulateDataExplorerGraphTypes() {
  it('should repopulate data explorer graph types', () => {
    component.isDataExplorerScatterPlotEnabled = false;
    component.isDataExplorerLineGraphEnabled = false;
    component.isDataExplorerBarGraphEnabled = false;
    component.repopulateDataExplorerGraphTypes();
    expect(component.isDataExplorerScatterPlotEnabled).toEqual(true);
    expect(component.isDataExplorerLineGraphEnabled).toEqual(false);
    expect(component.isDataExplorerBarGraphEnabled).toEqual(true);
  });
}

function shouldInitializeDataExplorerSeriesParams() {
  it('should initialize data explorer series params', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = null;
    component.authoringComponentContent.numDataExplorerSeries = 2;
    component.initializeDataExplorerSeriesParams();
    expect(component.authoringComponentContent.dataExplorerSeriesParams.length).toEqual(2);
  });
}

function shouldHandleNumDataExplorerSeriesChangeIncrease() {
  it('should handle num data explorer series change increase', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = [{}];
    component.authoringComponentContent.numDataExplorerSeries = 2;
    component.numDataExplorerSeriesChanged();
    expect(component.authoringComponentContent.dataExplorerSeriesParams.length).toEqual(2);
  });
}

function shouldHandleNumDataExplorerSeriesChangeDecrease() {
  it('should handle num data explorer series change decrease', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = [{}, {}, {}];
    component.authoringComponentContent.numDataExplorerSeries = 2;
    component.numDataExplorerSeriesChanged();
    expect(component.authoringComponentContent.dataExplorerSeriesParams.length).toEqual(2);
  });
}

function shouldIncreaseNumDataExplorerSeries() {
  it('should increase num data explorer series', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = [{}];
    component.increaseNumDataExplorerSeries(3);
    expect(component.authoringComponentContent.dataExplorerSeriesParams.length).toEqual(3);
  });
}

function shouldDecreaseNumDataExplorerSeries() {
  it('should decrease num data explorer series', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = [{}, {}, {}];
    component.decreaseNumDataExplorerSeries(1);
    expect(component.authoringComponentContent.dataExplorerSeriesParams.length).toEqual(1);
  });
}

function shouldUpdateDataExplorerSeriesParamsYAxis() {
  it('should update data explorer series params y axis', () => {
    component.authoringComponentContent.dataExplorerSeriesParams = [
      { yAxis: 0 },
      { yAxis: 1 },
      { yAxis: 2 }
    ];
    component.authoringComponentContent.numDataExplorerYAxis = 2;
    component.updateDataExplorerSeriesParamsYAxis();
    const dataExplorerSeriesParams = component.authoringComponentContent.dataExplorerSeriesParams;
    expect(dataExplorerSeriesParams[0].yAxis).toEqual(0);
    expect(dataExplorerSeriesParams[1].yAxis).toEqual(1);
    expect(dataExplorerSeriesParams[2].yAxis).toEqual(0);
  });
}
