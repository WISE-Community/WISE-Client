import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { GraphService } from '../../assets/wise5/components/graph/graphService';
import { SessionService } from '../../assets/wise5/services/sessionService';

let http: HttpTestingController;
const runId: number = 1;
let service: GraphService;

describe('GraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnnotationService,
        ConfigService,
        GraphService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService
      ]
    });
    service = TestBed.get(GraphService);
    http = TestBed.inject(HttpTestingController);
    spyOn(TestBed.inject(ConfigService), 'getRunId').and.returnValue(runId);
  });
  createComponent();
  isCompleted();
  hasComponentStates();
  hasSubmitComponentState();
  canEdit();
  hasSeriesData();
  hasTrialData();
  componentStateHasStudentWork();
  isStudentChangedAxisLimit();
  isXAxisChanged();
  isYAxisChanged();
  anyTrialHasDataPoint();
  trialHasDataPoint();
  anySeriesHasDataPoint();
  seriesHasDataPoint();
  generateImageFromRenderedComponentState();
  getHighchartsDiv();
  getTheSeriesFromTheTrials();
  getTheCategoryByIndex();
  getClassmateStudentWork();
});

function createComponentState(studentData: any, isSubmit: boolean = false) {
  return {
    studentData: studentData,
    isSubmit: isSubmit
  };
}

function createComponentContent(series: any[] = [], xAxis: any = {}, yAxis: any = {}) {
  return {
    connectedComponents: [],
    series: series,
    xAxis: xAxis,
    yAxis: yAxis
  };
}

function createStudentDataWithSeries(series: any[], xAxis: any = {}, yAxis: any = {}) {
  return {
    series: series,
    xAxis: xAxis,
    yAxis: yAxis
  };
}

function createStudentDataWithTrials(trials: any[], xAxis: any = {}, yAxis: any = {}) {
  return {
    trials: trials,
    xAxis: xAxis,
    yAxis: yAxis
  };
}

function createTrial(series: any[]) {
  return {
    series: series
  };
}

function createSingleSeries(data: any[], canEdit: boolean = true) {
  return {
    data: data,
    canEdit: canEdit
  };
}

function createAxis(min: number, max: number) {
  return {
    min: min,
    max: max
  };
}

function createComponent() {
  it('should create a graph component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Graph');
    expect(component.title).toEqual('');
    expect(component.width).toEqual(800);
    expect(component.height).toEqual(500);
    expect(component.enableTrials).toEqual(false);
    expect(component.canCreateNewTrials).toEqual(false);
    expect(component.canDeleteTrials).toEqual(false);
    expect(component.hideAllTrialsOnNewTrial).toEqual(false);
    expect(component.canStudentHideSeriesOnLegendClick).toEqual(false);
    expect(component.roundValuesTo).toEqual('integer');
    expect(component.graphType).toEqual('line');
    expect(component.xAxis).not.toEqual(null);
    expect(component.yAxis).not.toEqual(null);
    expect(component.series).not.toEqual(null);
  });
}

function isCompleted() {
  let component: any;
  let componentStates: any[];
  let nodeEvents: any[];
  let node: any;
  beforeEach(() => {
    component = createComponentContent();
    componentStates = [];
    nodeEvents = [];
    node = {};
  });
  function expectIsCompleted(
    component: any,
    componentStates: any[],
    nodeEvents: any[],
    node: any,
    expectedResult: boolean
  ) {
    expect(service.isCompleted(component, componentStates, nodeEvents, node)).toEqual(
      expectedResult
    );
  }
  it(`should check is completed when component when component is not editable and has no node
      entered event`, () => {
    component.series.push({ canEdit: false });
    expectIsCompleted(component, componentStates, nodeEvents, node, false);
  });
  it(`should check is completed when component when component is not editable and has no node
      entered event`, () => {
    component.series.push({ canEdit: false });
    nodeEvents.push({ event: 'nodeEntered' });
    expectIsCompleted(component, componentStates, nodeEvents, node, true);
  });
  it(`should check is completed when component when component is editable and component states have
      no student work`, () => {
    component.series.push({ canEdit: true });
    expectIsCompleted(component, componentStates, nodeEvents, node, false);
  });
  it(`should check is completed when component when component is editable and component states have
      student work`, () => {
    component.series.push({ canEdit: true });
    const trial = createTrial([createSingleSeries([{}])]);
    const studentData = createStudentDataWithTrials([trial]);
    const componentState = createComponentState(studentData);
    componentStates.push(componentState);
    expectIsCompleted(component, componentStates, nodeEvents, node, true);
  });
}

function hasComponentStates() {
  it('should check if there are component states when there are none', () => {
    expect(service.hasComponentStates([])).toEqual(false);
  });
  it('should check if there are component states when there is one', () => {
    expect(service.hasComponentStates([{}])).toEqual(true);
  });
}

function hasSubmitComponentState() {
  let componentStates: any[];
  beforeEach(() => {
    const trial = createTrial([createSingleSeries([])]);
    const studentData = createStudentDataWithTrials([trial]);
    const componentState = createComponentState(studentData);
    componentStates = [componentState];
  });
  function expectHasSubmitComponentState(componentStates: any[], expectedResult: boolean) {
    expect(service.hasSubmitComponentState(componentStates)).toEqual(expectedResult);
  }
  it('should check if there is a submit component state when there is no submit component state', () => {
    expectHasSubmitComponentState(componentStates, false);
  });
  it('should check if there is a submit component state when there is a submit component state', () => {
    componentStates[0].studentData.trials[0].series[0].data.push({});
    componentStates[0].isSubmit = true;
    expectHasSubmitComponentState(componentStates, true);
  });
}

function canEdit() {
  describe('canEdit()', () => {
    it('should return false when they can not edit', () => {
      const multipleSeries = [createSingleSeries([], false), createSingleSeries([], false)];
      const content = createComponentContent(multipleSeries);
      content.connectedComponents = [{ type: 'showWork' }];
      expect(service.canEdit(content)).toEqual(false);
    });
    it('should return true when they can edit', () => {
      const multipleSeries = [createSingleSeries([], false), createSingleSeries([], true)];
      expect(service.canEdit(createComponentContent(multipleSeries))).toEqual(true);
    });
  });
}

function hasSeriesData() {
  it('should return false when series is null', () => {
    expect(service.hasSeriesData({})).toBeFalsy();
  });
  it('should return false when series data is empty', () => {
    const studentData = createStudentDataWithSeries([{}]);
    expect(service.hasSeriesData(studentData)).toBeFalsy();
  });
  it('should return true when series has data', () => {
    const studentData = createStudentDataWithSeries([{ data: [[0, 10]] }]);
    expect(service.hasSeriesData(studentData)).toBeTruthy();
  });
}

function hasTrialData() {
  it('should return false when trials is null', () => {
    const studentData = createStudentDataWithTrials(null);
    expect(service.hasTrialData(studentData)).toBeFalsy();
  });
  it('should return false when there is no series in any trial', () => {
    const trials = [createTrial([createSingleSeries([])]), createTrial([createSingleSeries([])])];
    const studentData = createStudentDataWithTrials(trials);
    expect(service.hasTrialData(studentData)).toBeFalsy();
  });
  it('should return true when there is a series in a trial with data', () => {
    const trials = [
      createTrial([
        createSingleSeries([
          [1, 5],
          [2, 10]
        ])
      ])
    ];
    const studentData = createStudentDataWithTrials(trials);
    expect(service.hasTrialData(studentData)).toBeTruthy();
  });
}

function componentStateHasStudentWork() {
  function createComponentStateWithData(data: any[]) {
    const series = createSingleSeries(data);
    const trial = createTrial([series]);
    const studentData = createStudentDataWithTrials([trial]);
    return createComponentState(studentData);
  }
  function expectComponentStateHasStudentWork(componentState: any, expectedResult: boolean) {
    expect(service.componentStateHasStudentWork(componentState, {})).toEqual(expectedResult);
  }
  it('should return false when the component state does not have student work', () => {
    expectComponentStateHasStudentWork(createComponentStateWithData([]), false);
  });
  it('should return true when the component state has student work', () => {
    expectComponentStateHasStudentWork(createComponentStateWithData([0, 10]), true);
  });
}

function isStudentChangedAxisLimit() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    const xAxis = createAxis(0, 10);
    const yAxis = createAxis(0, 10);
    const studentData = {
      xAxis: xAxis,
      yAxis: yAxis
    };
    componentState = createComponentState(studentData);
    componentContent = createComponentContent([], xAxis, yAxis);
  });
  function expectIsStudentChangedAxisLimit(
    componentState: any,
    componentContent: any,
    expectedResult: boolean
  ) {
    expect(service.isStudentChangedAxisLimit(componentState, componentContent)).toEqual(
      expectedResult
    );
  }
  it('should return false when the student has not changed the axis limit', () => {
    expectIsStudentChangedAxisLimit(componentState, componentContent, false);
  });
  it('should return true when the student has changed the axis limit', () => {
    componentState.studentData.xAxis.max = 20;
    componentState.studentData.yAxis.max = 20;
    expectIsStudentChangedAxisLimit(componentState, componentContent, false);
  });
}

function isXAxisChanged() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    const studentData = { xAxis: createAxis(0, 10), yAxis: createAxis(0, 20) };
    componentState = createComponentState(studentData);
    componentContent = createComponentContent([], createAxis(0, 10), createAxis(0, 20));
  });
  function expectXAxisChanged(componentState: any, componentContent: any, expectedResult: boolean) {
    expect(service.isXAxisChanged(componentState, componentContent)).toEqual(expectedResult);
  }
  it('should check if x axis has changed when it has not changed', () => {
    expectXAxisChanged(componentState, componentContent, false);
  });
  it('should check if x axis has changed when it has changed', () => {
    componentState.studentData.xAxis.max = 30;
    expectXAxisChanged(componentState, componentContent, true);
  });
}

function isYAxisChanged() {
  let componentState: any;
  let componentContent: any;
  beforeEach(() => {
    const studentData = { xAxis: createAxis(0, 10), yAxis: createAxis(0, 20) };
    componentState = createComponentState(studentData);
    componentContent = createComponentContent([], createAxis(0, 10), createAxis(0, 20));
  });
  function expectYAxisChanged(componentState: any, componentContent: any, expectedResult: boolean) {
    expect(service.isYAxisChanged(componentState, componentContent)).toEqual(expectedResult);
  }
  it('should check if y axis has changed when it has not changed', () => {
    expectYAxisChanged(componentState, componentContent, false);
  });
  it('should check if y axis has changed when it has changed', () => {
    componentState.studentData.yAxis.max = 30;
    expectYAxisChanged(componentState, componentContent, true);
  });
}

function anyTrialHasDataPoint() {
  let trials: any[];
  beforeEach(() => {
    trials = [];
  });
  function expectAnyTrialHasDataPoint(trials: any[], expectedResult: boolean) {
    expect(service.anyTrialHasDataPoint(trials)).toEqual(expectedResult);
  }
  it('should check if any trial has a data point when it does not have any data points', () => {
    trials.push(createTrial([createSingleSeries([])]));
    expectAnyTrialHasDataPoint(trials, false);
  });
  it('should check if any trial has a data point when it does have a data point', () => {
    trials.push(createTrial([createSingleSeries([{}])]));
    expectAnyTrialHasDataPoint(trials, true);
  });
}

function trialHasDataPoint() {
  let trial: any;
  beforeEach(() => {
    trial = createTrial([]);
  });
  function expectTrialHasDataPoint(trial: any, expectedResult: boolean) {
    expect(service.trialHasDataPoint(trial)).toEqual(expectedResult);
  }
  it('should check if a trial has a data point when it does not have any data points', () => {
    trial.series.push(createSingleSeries([]));
    expectTrialHasDataPoint(trial, false);
  });
  it('should check if a trial has a data point when it does have a data point', () => {
    trial.series.push(createSingleSeries([{}]));
    expectTrialHasDataPoint(trial, true);
  });
}

function anySeriesHasDataPoint() {
  let multipleSeries: any[];
  beforeEach(() => {
    multipleSeries = [];
  });
  function expectAnySeriesHasDataPoint(multipleSeries: any[], expectedResult: boolean) {
    expect(service.anySeriesHasDataPoint(multipleSeries)).toEqual(expectedResult);
  }
  it('should check if any series has a data point when they do not have any data points', () => {
    multipleSeries.push(createSingleSeries([]));
    multipleSeries.push(createSingleSeries([]));
    expectAnySeriesHasDataPoint(multipleSeries, false);
  });
  it('should check if any series has a data point when they do have a data point', () => {
    multipleSeries.push(createSingleSeries([]));
    multipleSeries.push(createSingleSeries([{}]));
    expectAnySeriesHasDataPoint(multipleSeries, true);
  });
}

function seriesHasDataPoint() {
  function expectSeriesHasDataPoint(singleSeries: any, expectedResult: boolean) {
    expect(service.seriesHasDataPoint(singleSeries)).toEqual(expectedResult);
  }
  it('should check if a series has a data point when it does not', () => {
    expectSeriesHasDataPoint(createSingleSeries([]), false);
  });
  it('should check if a series has a data point when it does', () => {
    expectSeriesHasDataPoint(createSingleSeries([{}]), true);
  });
}

function generateImageFromRenderedComponentState() {
  // TODO
}

function getHighchartsDiv() {
  // TODO
}

function getTheSeriesFromTheTrials() {
  it('should get the series from the trials', () => {
    const trials = [
      {
        name: 'Trial 1',
        show: true,
        series: [
          {
            name: 'Prediction',
            data: [
              [0, 0],
              [10, 20],
              [20, 40]
            ]
          },
          {
            name: 'Actual',
            data: [
              [0, 0],
              [10, 30],
              [20, 60]
            ]
          }
        ],
        id: 'u3ijj5vfxd'
      },
      {
        name: 'Trial 2',
        show: true,
        series: [
          {
            name: 'Prediction',
            data: [
              [0, 0],
              [30, 20],
              [40, 40]
            ]
          },
          {
            name: 'Actual',
            data: [
              [0, 0],
              [30, 30],
              [40, 60]
            ]
          }
        ],
        id: 'u3ijj5vfxd'
      }
    ];
    const series = service.getSeriesFromTrials(trials);
    expect(series.length).toEqual(4);
  });
}

function getTheCategoryByIndex() {
  it('should get the category by index', () => {
    const xAxis = {
      categories: ['Computers', 'Phones', 'Pizzas']
    };
    expect(service.getCategoryByIndex(0, xAxis)).toEqual('Computers');
    expect(service.getCategoryByIndex(1, xAxis)).toEqual('Phones');
    expect(service.getCategoryByIndex(2, xAxis)).toEqual('Pizzas');
  });
}

function getClassmateStudentWork() {
  const componentId1 = 'component1';
  const componentId2 = 'component2';
  const nodeId1 = 'node1';
  const nodeId2 = 'node2';
  const periodId = 100;
  it('should get classmate student work from period', () => {
    service
      .getClassmateStudentWork(nodeId2, componentId2, periodId, nodeId1, componentId1, 'period')
      .subscribe();
    http
      .expectOne(
        `/api/classmate/graph/student-work/${runId}/${nodeId2}/${componentId2}/${nodeId1}/${componentId1}/period/${periodId}`
      )
      .flush([]);
  });

  it(
    'should get classmate student work from class',
    waitForAsync(() => {
      service
        .getClassmateStudentWork(nodeId2, componentId2, periodId, nodeId1, componentId1, 'class')
        .subscribe();
      http
        .expectOne(
          `/api/classmate/graph/student-work/${runId}/${nodeId2}/${componentId2}/${nodeId1}/${componentId1}/class`
        )
        .flush([]);
    })
  );
}
