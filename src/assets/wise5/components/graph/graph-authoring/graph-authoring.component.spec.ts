import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { GraphAuthoring } from './graph-authoring.component';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { ComponentAuthoringModule } from '../../component-authoring.module';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';

let component: GraphAuthoring;
let fixture: ComponentFixture<GraphAuthoring>;

describe('GraphAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ComponentAuthoringModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [GraphAuthoring, EditComponentPrompt],
      providers: [ProjectAssetService, TeacherNodeService, TeacherProjectService]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(GraphAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    spyOn(component, 'componentChanged').and.callFake(() => {});
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });

  addAnyMissingYAxisFields();
  addAnyMissingYAxisFieldsToAllYAxesWithMultipleYAxes();
  addAnyMissingYAxisFieldsToAllYAxesWithOneYAxis();
  addColorToSeries();
  addColorToYAxes();
  addYAxisToAllSeries();
  convertSingleYAxisToMultipleYAxes();
  convertMultipleYAxesToSingleYAxis();
  decreaseNumYAxes();
  decreaseYAxes();
  getYAxisColor();
  handleSeriesYAxisChanged();
  increaseNumYAxes();
  increaseYAxes();
  removeYAxisToAllSeries();
  setSeriesColorToMatchYAxisColor();
  setTheNewSeriesColorToMatchYAxis();
  turnOffMultipleYAxes();
  turnOnMultipleYAxes();
  updateSeriesColorsToMatchYAxisColor();
  updateSeriesYAxisAndColorWhenYAxisIsRemoved();
  updateYAxisTitleColor();
});

function createComponentContent() {
  return {
    id: '86fel4wjm4',
    type: 'Graph',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    xAxis: {
      plotLines: [],
      title: {
        text: ''
      }
    },
    yAxis: {
      plotLines: [],
      title: {
        text: ''
      }
    }
  };
}

function createYAxis(color: string = null) {
  return {
    labels: {
      style: {
        color: color
      }
    },
    title: {
      style: {
        color: color
      }
    }
  };
}

function convertSingleYAxisToMultipleYAxes() {
  it('should convert single Y axis to multiple y axes', () => {
    const firstYAxis = {
      title: {
        text: 'Count'
      },
      min: 0,
      max: 100,
      units: '',
      locked: true
    };
    component.componentContent.yAxis = firstYAxis;
    component.convertSingleYAxisToMultipleYAxes();
    expect(Array.isArray(component.componentContent.yAxis)).toBe(true);
    const yAxis = component.componentContent.yAxis;
    expect(yAxis.length).toEqual(2);
    expect(yAxis[0]).toEqual(firstYAxis);
    expect(yAxis[1].title.text).toEqual('');
    expect(yAxis[1].opposite).toEqual(true);
  });
}

function convertMultipleYAxesToSingleYAxis() {
  it('should convert multiple Y axes to single y axis', () => {
    const firstYAxis = {
      title: {
        text: 'Count'
      },
      min: 0,
      max: 100,
      units: '',
      locked: true
    };
    const secondYAxis = {
      title: {
        text: 'Price'
      },
      min: 0,
      max: 1000,
      units: '',
      locked: true,
      opposite: true
    };
    component.componentContent.yAxis = [firstYAxis, secondYAxis];
    component.convertMultipleYAxesToSingleYAxis();
    expect(Array.isArray(component.componentContent.yAxis)).toBe(false);
    expect(component.componentContent.yAxis).toEqual(firstYAxis);
  });
}

function addYAxisToAllSeries() {
  it('should add y axis to all series', () => {
    component.componentContent.series = [{ name: 'Prediction' }, { name: 'Actual' }];
    component.addYAxisToAllSeries();
    expect(component.componentContent.series[0].yAxis).toEqual(0);
    expect(component.componentContent.series[1].yAxis).toEqual(0);
  });
}

function removeYAxisToAllSeries() {
  it('should remove y axes from all series', () => {
    component.componentContent.series = [
      { name: 'Prediction', yAxis: 0 },
      { name: 'Actual', yAxis: 1 }
    ];
    component.removeYAxisFromAllSeries();
    expect(component.componentContent.series[0].yAxis).toBeUndefined();
    expect(component.componentContent.series[1].yAxis).toBeUndefined();
  });
}

function increaseYAxes() {
  it('should increase y axes', () => {
    component.componentContent.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      }
    ];
    component.increaseYAxes(4);
    const yAxis = component.componentContent.yAxis;
    expect(yAxis.length).toEqual(4);
    expect(yAxis[0].title.text).toEqual('Y Axis 1');
    expect(yAxis[1].title.text).toEqual('Y Axis 2');
    expect(yAxis[2].title.text).toEqual('');
    expect(yAxis[3].title.text).toEqual('');
  });
}

function decreaseYAxes() {
  it('should decrease y axes', () => {
    component.componentContent.yAxis = [
      {
        title: { text: 'Y Axis 1' }
      },
      {
        title: { text: 'Y Axis 2' }
      },
      {
        title: { text: 'Y Axis 3' }
      }
    ];
    component.decreaseYAxes(2);
    const yAxis = component.componentContent.yAxis;
    expect(yAxis.length).toEqual(2);
    expect(yAxis[0].title.text).toEqual('Y Axis 1');
    expect(yAxis[1].title.text).toEqual('Y Axis 2');
  });
}

function updateYAxisTitleColor() {
  it('should update y axis title color', () => {
    const yAxis = createYAxis('red');
    component.componentContent.yAxis = [yAxis];
    component.componentContent.series = [];
    yAxis.labels.style.color = 'blue';
    component.yAxisColorChanged(0);
    expect(yAxis.title.style.color).toEqual('blue');
  });
}

function addAnyMissingYAxisFields() {
  it('should add any missing y axis fields', () => {
    const yAxis: any = {};
    component.addAnyMissingYAxisFields(yAxis);
    expect(yAxis.title.style).toBeDefined();
    expect(yAxis.labels.style).toBeDefined();
  });
}

function addAnyMissingYAxisFieldsToAllYAxesWithOneYAxis() {
  it('should add any missing y axis fields to all y axes with one y axis', () => {
    const yAxis: any = {};
    component.addAnyMissingYAxisFieldsToAllYAxes(yAxis);
    expect(yAxis.title.style).toBeDefined();
    expect(yAxis.labels.style).toBeDefined();
    expect(yAxis.allowDecimals).toBe(false);
    expect(yAxis.opposite).toBe(false);
  });
}

function addAnyMissingYAxisFieldsToAllYAxesWithMultipleYAxes() {
  it('should add any missing y axis fields to all y axes with multiple y axes', () => {
    const yAxis: any[] = [{}, {}];
    component.addAnyMissingYAxisFieldsToAllYAxes(yAxis);
    expect(yAxis[0].title.style).toBeDefined();
    expect(yAxis[0].labels.style).toBeDefined();
    expect(yAxis[0].allowDecimals).toBe(false);
    expect(yAxis[0].opposite).toBe(false);
    expect(yAxis[1].title.style).toBeDefined();
    expect(yAxis[1].labels.style).toBeDefined();
    expect(yAxis[1].allowDecimals).toBe(false);
    expect(yAxis[1].opposite).toBe(false);
  });
}

function addColorToYAxes() {
  it('should add color to y axes', () => {
    component.componentContent.yAxis = [createYAxis(), createYAxis(), createYAxis(), createYAxis()];
    component.addColorToYAxes();
    const yAxis = component.componentContent.yAxis;
    expect(yAxis[0].title.style.color).toEqual('blue');
    expect(yAxis[0].labels.style.color).toEqual('blue');
    expect(yAxis[1].title.style.color).toEqual('red');
    expect(yAxis[1].labels.style.color).toEqual('red');
    expect(yAxis[2].title.style.color).toEqual('green');
    expect(yAxis[2].labels.style.color).toEqual('green');
    expect(yAxis[3].title.style.color).toEqual('orange');
    expect(yAxis[3].labels.style.color).toEqual('orange');
  });
}

function addColorToSeries() {
  it('should add color to series', () => {
    component.componentContent.yAxis = [createYAxis('blue'), createYAxis('red')];
    component.componentContent.series = [{ yAxis: 0 }, { yAxis: 1 }];
    component.addColorToSeries();
    expect(component.componentContent.series[0].color).toEqual('blue');
    expect(component.componentContent.series[1].color).toEqual('red');
  });
}

function setSeriesColorToMatchYAxisColor() {
  it('should set series color to match y axis color', () => {
    component.componentContent.yAxis = [createYAxis('blue'), createYAxis('red')];
    const series: any = {
      yAxis: 0
    };
    component.setSeriesColorToMatchYAxisColor(series);
    expect(series.color).toEqual('blue');
    series.yAxis = 1;
    component.setSeriesColorToMatchYAxisColor(series);
    expect(series.color).toEqual('red');
  });
}

function getYAxisColor() {
  it('should get y axis color', () => {
    component.componentContent.yAxis = [createYAxis('blue'), createYAxis('red')];
    expect(component.getYAxisColor(0)).toEqual('blue');
    expect(component.getYAxisColor(1)).toEqual('red');
  });
}

function updateSeriesColorsToMatchYAxisColor() {
  it('should update series colors', () => {
    const series1 = { yAxis: 0, color: 'blue' };
    const series2 = { yAxis: 1, color: 'blue' };
    const series3 = { yAxis: 2, color: 'blue' };
    const series4 = { yAxis: 0, color: 'blue' };
    component.componentContent.series = [series1, series2, series3, series4];
    component.updateSeriesColors(0, 'green');
    expect(series1.color).toEqual('green');
    expect(series2.color).toEqual('blue');
    expect(series3.color).toEqual('blue');
    expect(series4.color).toEqual('green');
  });
}

function handleSeriesYAxisChanged() {
  it('should handle series y axis changed', () => {
    component.componentContent.yAxis = [createYAxis('blue'), createYAxis('red')];
    const series: any = {
      yAxis: 1
    };
    component.seriesYAxisChanged(series);
    expect(series.color).toEqual('red');
  });
}

function setTheNewSeriesColorToMatchYAxis() {
  it('should set the new series color to match y axis', () => {
    component.componentContent.yAxis = [createYAxis('black'), createYAxis('red')];
    component.enableMultipleYAxes = true;
    component.componentContent.series = [];
    component.addSeriesClicked();
    expect(component.componentContent.series[0].color).toEqual('black');
  });
}

function turnOnMultipleYAxes() {
  it('should turn on multiple y axes', () => {
    component.componentContent.yAxis = createYAxis('black');
    component.enableMultipleYAxes = true;
    component.componentContent.series = [{}];
    component.enableMultipleYAxesChanged();
    expect(component.componentContent.yAxis.length).toEqual(2);
    expect(component.componentContent.series[0].color).toEqual('black');
  });
}

function turnOffMultipleYAxes() {
  it('should turn off multiple y axes', () => {
    component.componentContent.yAxis = [createYAxis('black')];
    component.enableMultipleYAxes = false;
    component.componentContent.series = [{}];
    spyOn(window, 'confirm').and.returnValue(true);
    component.enableMultipleYAxesChanged();
    expect(Array.isArray(component.componentContent.yAxis)).toEqual(false);
    expect(component.componentContent.series[0].yAxis).toBeUndefined();
  });
}

function increaseNumYAxes() {
  it('should increase num y axes', () => {
    component.componentContent.yAxis = [createYAxis('blue'), createYAxis('red')];
    component.numYAxesChanged(4, 2);
    const yAxis = component.componentContent.yAxis;
    expect(yAxis.length).toEqual(4);
    expect(yAxis[0].labels.style.color).toEqual('blue');
    expect(yAxis[1].labels.style.color).toEqual('red');
    expect(yAxis[2].labels.style.color).toEqual('green');
    expect(yAxis[3].labels.style.color).toEqual('orange');
  });
}

function decreaseNumYAxes() {
  it('should decrease num y axes', () => {
    component.componentContent.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green'),
      createYAxis('orange')
    ];
    component.componentContent.series = [];
    spyOn(window, 'confirm').and.returnValue(true);
    component.numYAxesChanged(2, 4);
    const yAxis = component.componentContent.yAxis;
    expect(yAxis.length).toEqual(2);
    expect(yAxis[0].labels.style.color).toEqual('blue');
    expect(yAxis[1].labels.style.color).toEqual('red');
  });
}

function updateSeriesYAxisAndColorWhenYAxisIsRemoved() {
  it('should update series y axis and color when y axis is removed', () => {
    component.componentContent.yAxis = [
      createYAxis('blue'),
      createYAxis('red'),
      createYAxis('green')
    ];
    component.componentContent.series = [
      {
        yAxis: 2,
        color: 'green'
      }
    ];
    spyOn(window, 'confirm').and.returnValue(true);
    component.numYAxesChanged(2, 3);
    const singleSeries = component.componentContent.series[0];
    expect(singleSeries.yAxis).toEqual(0);
    expect(singleSeries.color).toEqual('blue');
  });
}
