import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { GraphService } from '../graphService';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import canvg from 'canvg';
import { MatDialog } from '@angular/material/dialog';
import { GraphContent } from '../GraphContent';
import { copy } from '../../../common/object/object';
import { convertToPNGFile } from '../../../common/canvas/canvas';
import { arraysContainSameValues } from '../../../common/array/array';
import { generateRandomKey } from '../../../common/string/string';
import { GraphCustomLegend } from '../GraphCustomLegend';
import { PlotLineManager } from '../plot-line-manager';
import { DataExplorerManager } from '../data-explorer-manager';
import { addPointFromTableIntoData, isMultipleYAxes, isSingleYAxis } from '../util';

const Draggable = require('highcharts/modules/draggable-points.js');
Draggable(Highcharts);
HC_exporting(Highcharts);

@Component({
  selector: 'graph-student',
  templateUrl: 'graph-student.component.html',
  styleUrls: ['graph-student.component.scss']
})
export class GraphStudent extends ComponentStudent {
  activeSeries: any = null;
  activeTrial: any = null;
  addNextComponentStateToUndoStack: boolean = false;
  backgroundImage: string = null;
  canCreateNewTrials: boolean = false;
  canDeleteTrials: boolean = false;
  chartCallback: any;
  chartConfig: any;
  chartId: string = 'chart1';
  fileName: string;
  graphType: string;
  hasCustomLegendBeenSet: boolean = false;
  height: number = null;
  hiddenCanvasId: string = 'hiddenCanvas_' + this.componentId;
  @ViewChild('hiddenButton') hiddenButtonElement: ElementRef;
  hideAllTrialsOnNewTrial: boolean = true;
  Highcharts: typeof Highcharts = Highcharts;
  initialComponentState: any = null;
  isLegendEnabled: boolean = true;
  isLoaded: boolean = false;
  isResetSeriesButtonVisible: boolean = false;
  isSelectSeriesVisible: boolean = false;
  lastDropTime: number;
  lastSavedMouseMoveTimestamp: number;
  mouseDown: boolean = false;
  mouseOverPoints: any[] = [];
  notebookConfig: any = this.NotebookService.getNotebookConfig();
  plotLineManager: PlotLineManager;
  previousComponentState: any;
  previousTrialIdsToShow: string[];
  rectangle: any;
  series: any[] = [];
  seriesMarkers: string[] = ['circle', 'square', 'diamond', 'triangle', 'triangle-down', 'circle'];
  setupMouseMoveListenerDone: boolean = false;
  showTrialSelect: boolean = true;
  showUndoButton: boolean = false;
  studentDataVersion: number = 2;
  subtitle: string;
  title: string;
  trialIdsToShow: string[] = [];
  trials: any[] = [];
  undoStack: any = [];
  updateFlag: boolean = false;
  uploadedFileName: string = null;
  width: number = null;
  xAxis: any;
  xAxisLimitSpacerWidth: number;
  yAxis: any;
  yAxisLocked: boolean;

  constructor(
    protected AnnotationService: AnnotationService,
    private changeDetectorRef: ChangeDetectorRef,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private GraphService: GraphService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.chartId = 'chart_' + this.componentId;
    this.hiddenCanvasId = 'hiddenCanvas_' + this.componentId;
    this.plotLineManager = new PlotLineManager(
      this.componentContent.xAxis.plotLines,
      this.componentContent.showMouseXPlotLine,
      this.componentContent.showMouseYPlotLine
    );
    this.initializeComponentContentParams();
    this.initializeStudentMode(this.componentState);
    this.initialComponentState = this.componentState;
    this.previousComponentState = this.componentState;
    if (!this.canSubmit()) {
      this.isSubmitButtonDisabled = true;
    }
    this.disableComponentIfNecessary();
    this.chartCallback = this.createChartCallback();
    this.drawGraph().then(() => {
      this.broadcastDoneRenderingComponent();
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  initializeComponentContentParams() {
    this.title = this.componentContent.title;
    this.subtitle = this.componentContent.subtitle;
    this.width = this.componentContent.width;
    this.height = this.componentContent.height;
    this.xAxis = copy(this.componentContent.xAxis);
    this.yAxis = copy(this.componentContent.yAxis);
    this.graphType = this.componentContent.graphType;
    if (this.graphType == null) {
      this.graphType = 'line';
    }
    if (this.componentContent.canCreateNewTrials != null) {
      this.canCreateNewTrials = this.componentContent.canCreateNewTrials;
    }
    if (this.componentContent.canDeleteTrials != null) {
      this.canDeleteTrials = this.componentContent.canDeleteTrials;
    }
    if (this.componentContent.hideAllTrialsOnNewTrial === false) {
      this.hideAllTrialsOnNewTrial = false;
    }
    if (this.componentContent.hideLegend) {
      this.isLegendEnabled = false;
    }
    if (this.componentContent.hideTrialSelect) {
      this.showTrialSelect = false;
    }
    this.yAxisLocked = this.isYAxisLocked();
  }

  isYAxisLocked() {
    if (Array.isArray(this.componentContent.yAxis)) {
      return this.componentContent.yAxis
        .map((yAxis) => yAxis.locked)
        .reduce((accumulator, currentValue) => {
          return accumulator && currentValue;
        });
    } else {
      return this.componentContent.yAxis.locked;
    }
  }

  initializeStudentMode(componentState) {
    this.isResetSeriesButtonVisible = true;
    this.isSelectSeriesVisible = true;
    this.backgroundImage = this.componentContent.backgroundImage;
    if (!this.GraphService.componentStateHasStudentWork(componentState, this.componentContent)) {
      this.newTrial();
    }
    if (
      this.component.hasConnectedComponentAlwaysField() ||
      this.hasConnectedComponentShowClassmateWork(this.componentContent)
    ) {
      this.handleConnectedComponents();
    } else if (
      this.GraphService.componentStateHasStudentWork(componentState, this.componentContent)
    ) {
      this.setStudentWork(componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    }
  }

  hasConnectedComponentShowClassmateWork(componentContent: any): boolean {
    return (
      componentContent.connectedComponents != null &&
      componentContent.connectedComponents.some(
        (connectedComponent: any) => connectedComponent.type === 'showClassmateWork'
      )
    );
  }

  processConnectedComponentState(componentState: any): void {
    const connectedComponent = this.component.getConnectedComponent(
      componentState.nodeId,
      componentState.componentId
    );
    const componentType = this.ProjectService.getComponentType(
      connectedComponent.nodeId,
      connectedComponent.componentId
    );
    if (componentType === 'Table') {
      this.handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState);
    } else if (componentType === 'Embedded') {
      this.handleEmbeddedConnectedComponentStudentDataChanged(connectedComponent, componentState);
    } else if (componentType === 'Animation') {
      this.handleAnimationConnectedComponentStudentDataChanged(connectedComponent, componentState);
    }
  }

  fileUploadChanged(event) {
    const activeSeriesData = this.activeSeries.data;
    let overwrite = true;
    if (activeSeriesData.length > 0) {
      if (!confirm($localize`Are you sure you want to overwrite the current line data?`)) {
        overwrite = false;
      }
    }
    if (overwrite) {
      this.uploadFileAndReadContent(event);
    }
    // clear the file input value so that onchange() will be called again if the student wants to
    // upload the same file again
    event.srcElement.value = null;
  }

  uploadFileAndReadContent(event) {
    const files = event.target.files;
    const reader: any = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      this.readCSVIntoActiveSeries(fileContent);
      this.setUploadedFileName(this.fileName);
      this.studentDataChanged();
    };
    reader.scope = this;
    reader.fileName = files[0].name;
    reader.readAsText(files[0]);
    this.StudentAssetService.uploadAsset(files[0]);
  }

  handleTableConnectedComponentStudentDataChanged(connectedComponent, componentState) {
    const studentData = copy(componentState.studentData);
    if (studentData.tableData.length > 0) {
      studentData.tableData = this.processTableData(
        studentData.tableData,
        studentData.sortOrder,
        studentData.selectedRowIndices
      );
    }
    if (studentData.isDataExplorerEnabled) {
      this.handleDataExplorer(studentData);
    } else {
      this.handleConnectedComponentData(studentData, connectedComponent);
    }
    this.drawGraph();
    this.isDirty = true;
  }

  private processTableData(
    tableData: any[],
    sortOrder: number[] = [],
    selectedRowIndices: number[] = []
  ): any[] {
    if (sortOrder && sortOrder.length > 0) {
      return this.getSortedAndFilteredTableData(tableData, sortOrder, selectedRowIndices);
    } else {
      return this.getFilteredTableData(tableData, selectedRowIndices);
    }
  }

  private getSortedAndFilteredTableData(
    tableData: any[],
    sortOrder: number[],
    selectedRowIndices: number[]
  ): any[] {
    const sortedTableData = [tableData[0]];
    sortOrder.forEach((rowNumber, index) => {
      if (this.isRowSelected(rowNumber, selectedRowIndices)) {
        sortedTableData.push(tableData[rowNumber + 1]);
      }
    });
    return sortedTableData;
  }

  private isRowSelected(rowNumber: number, selectedRowIndices: number[]): boolean {
    return selectedRowIndices.length > 0 ? selectedRowIndices.includes(rowNumber) : true;
  }

  private getFilteredTableData(tableData: any[], selectedRowIndices: number[]): any[] {
    let visibleRows = tableData;
    if (selectedRowIndices && selectedRowIndices.length > 0) {
      visibleRows = [tableData[0]];
      tableData.forEach((row, index) => {
        if (this.isRowSelected(index - 1, selectedRowIndices)) {
          visibleRows.push(row);
        }
      });
    }
    return visibleRows;
  }

  private handleDataExplorer(studentData: any): void {
    // clear graph to prevent issues with Highcharts merging old series data with new series data
    this.activeTrial.series = [];
    this.drawGraph();
    this.changeDetectorRef.detectChanges();
    const dataExplorerManager = new DataExplorerManager(this.xAxis, this.yAxis, this.activeTrial);
    const allRegressionSeries = dataExplorerManager.handleDataExplorer(studentData);

    // Add all the regression series after all the data series so that all the data series are
    // located at the expected index within the active trial. We need to do this because we expect
    // the series index to match up with the axis index like in GraphService.getAxisTitle().
    for (const singleRegressionSeries of allRegressionSeries) {
      this.activeTrial.series.push(singleRegressionSeries);
    }
  }

  private handleConnectedComponentData(studentData: any, connectedComponent: any): void {
    const rows = studentData.tableData;
    const data = this.convertRowDataToSeriesData(rows, connectedComponent);
    let seriesIndex = connectedComponent.seriesIndex;
    if (seriesIndex == null) {
      seriesIndex = 0;
    }
    if (this.isStudentDataVersion1()) {
      let series = this.series[seriesIndex];
      if (series == null) {
        series = {};
        this.series[seriesIndex] = series;
      }
      series.data = data;
    } else {
      const trial = this.activeTrial;
      if (trial != null && trial.series != null) {
        let series = trial.series[seriesIndex];
        if (series == null) {
          series = {};
          this.series[seriesIndex] = series;
        }
        series.data = data;
      }
    }
  }

  handleEmbeddedConnectedComponentStudentDataChanged(connectedComponent, componentState) {
    componentState = copy(componentState);
    const studentData = componentState.studentData;
    this.processConnectedComponentStudentData(studentData, connectedComponent);
    this.studentDataChanged();
  }

  handleAnimationConnectedComponentStudentDataChanged(connectedComponent, componentState) {
    if (componentState.t != null) {
      this.plotLineManager.setXPlotLine(componentState.t);
      this.drawGraph();
    }
  }

  setupMouseMoveListener() {
    if (!this.setupMouseMoveListenerDone) {
      const chart = $(`#${this.chartId}`);
      // Remove all existing listeners on the chart div to make sure we don't bind the same listener
      // multiple times.
      chart.off();
      chart.on('mousedown', (e) => {
        this.mouseDown = true;
        this.mouseDownEventOccurred(e);
      });
      chart.on('mouseup', (e) => {
        this.mouseDown = false;
      });
      chart.on('mousemove', (e) => {
        if (this.mouseDown) {
          this.mouseDownEventOccurred(e);
        }
      });
      chart.on('mouseleave', (e) => {
        this.mouseDown = false;
      });
      this.setupMouseMoveListenerDone = true;
    }
  }

  /**
   * The student has moved the mouse while holding the mouse button down.
   * @param e The mouse event.
   */
  mouseDownEventOccurred(e) {
    /*
     * Firefox displays abnormal behavior when the student drags the plot line.
     * In Firefox, when the mouse is on top of the plot line, the event will
     * contain offset values relative to the plot line instead of relative to
     * the graph container. We always want the offset values relative to the
     * graph container so we will ignore events where the offset values are
     * relative to the plot line.
     */
    if (e.offsetX < 10 || e.offsetY < 10) {
      return;
    }
    const x = this.handleMouseDownXPosition(e);
    const y = this.handleMouseDownYPosition(e);
    if (this.componentContent.saveMouseOverPoints) {
      /*
       * Make sure we aren't saving the points too frequently. We want to avoid
       * saving too many unnecessary data points.
       */
      const currentTimestamp = new Date().getTime();
      /*
       * Make sure this many milliseconds has passed before saving another mouse
       * over point.
       */
      const timeBetweenSendingMouseOverPoints = 200;
      if (
        this.lastSavedMouseMoveTimestamp == null ||
        currentTimestamp - this.lastSavedMouseMoveTimestamp > timeBetweenSendingMouseOverPoints
      ) {
        this.addMouseOverPoint(x, y);
        this.studentDataChanged();
        this.lastSavedMouseMoveTimestamp = currentTimestamp;
      }
    }
  }

  handleMouseDownXPosition(e) {
    const chart = this.getChartById(this.chartId);
    const chartXAxis = chart.xAxis[0];
    let x = chartXAxis.toValue(e.offsetX, false);
    x = this.makeSureXIsWithinXMinMaxLimits(x);
    if (this.plotLineManager.isShowMouseXPlotLine()) {
      this.showXPlotLine(x);
    }
    return x;
  }

  handleMouseDownYPosition(e) {
    const chart = this.getChartById(this.chartId);
    const chartYAxis = chart.yAxis[0];
    let y = chartYAxis.toValue(e.offsetY, false);
    y = this.makeSureYIsWithinYMinMaxLimits(y);
    if (this.plotLineManager.isShowMouseYPlotLine()) {
      this.plotLineManager.showYPlotLine(this.getChartById(this.chartId), y);
    }
    return y;
  }

  /**
   * Draw a rectangle on the graph. This is used for highlighting a range.
   * @param xMin The left x value in the graph x axis units.
   * @param xMax The right x value in the graph x axis units.
   * @param yMin The bottom y value in the graph y axis units.
   * @param yMax The top y value in the graph y axis units.
   * @param strokeColor The color of the border.
   * @param strokeWidth The width of the border.
   * @param fillColor The color inside the rectangle.
   * @param fillOpacity The opacity of the color inside the rectangle.
   */
  drawRangeRectangle(
    xMin,
    xMax,
    yMin,
    yMax,
    strokeColor = 'black',
    strokeWidth = '.5',
    fillColor = 'black',
    fillOpacity = '.1'
  ) {
    this.createRectangleIfNecessary(strokeColor, strokeWidth, fillColor, fillOpacity);
    xMin = this.convertToXPixels(xMin);
    xMax = this.convertToXPixels(xMax);
    yMin = this.convertToYPixels(yMin);
    yMax = this.convertToYPixels(yMax);
    this.updateRectanglePositionAndSize(xMin, xMax, yMin, yMax);
  }

  convertToXPixels(graphUnitValue) {
    const chart: any = this.getChartById(this.chartId);
    return chart.xAxis[0].translate(graphUnitValue);
  }

  convertToYPixels(graphUnitValue) {
    const chart: any = this.getChartById(this.chartId);
    return chart.yAxis[0].translate(graphUnitValue);
  }

  createRectangleIfNecessary(strokeColor, strokeWidth, fillColor, fillOpacity) {
    if (this.rectangle == null) {
      const chart = this.getChartById(this.chartId);
      this.rectangle = chart.renderer
        .rect(0, 0, 0, 0, 0)
        .css({
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: fillColor,
          fillOpacity: fillOpacity
        })
        .add();
    }
  }

  updateRectanglePositionAndSize(xMin, xMax, yMin, yMax) {
    const chart = this.getChartById(this.chartId);
    this.rectangle.attr({
      x: xMin + chart.plotLeft,
      y: chart.plotHeight + chart.plotTop - yMax,
      width: xMax - xMin,
      height: yMax - yMin
    });
  }

  /**
   * If the x value is not within the x min and max limits, we will modify the x value to be at the
   * limit.
   * @param x the x value
   * @return an x value between the x min and max limits
   */
  makeSureXIsWithinXMinMaxLimits(x) {
    if (x < this.xAxis.min) {
      x = this.xAxis.min;
    }
    if (x > this.xAxis.max) {
      x = this.xAxis.max;
    }
    return x;
  }

  /**
   * If the y value is not within the y min and max limits, we will modify the y value to be at the
   * limit.
   * @param y the y value
   * @return a y value between the y min and max limits
   */
  makeSureYIsWithinYMinMaxLimits(y) {
    if (y < this.yAxis.min) {
      y = this.yAxis.min;
    }
    if (y > this.yAxis.max) {
      y = this.yAxis.max;
    }
    return y;
  }

  /**
   * Add a mouse over point to the array of student mouse over points.
   * @param x the x value in graph units
   * @param y the y value in graph units
   */
  addMouseOverPoint(x, y) {
    this.mouseOverPoints.push([x, y]);
  }

  /**
   * @param useTimeout whether to call the drawGraphHelper() function in a timeout callback
   */
  drawGraph(useTimeout: boolean = false) {
    return new Promise((resolve, reject) => {
      if (useTimeout) {
        /*
         * Clear the chart config so that the graph is completely refreshed. We need to do this
         * otherwise all the series will react to mouseover but we only want the active series to
         * react to mouseover.
         */
        this.clearChartConfig();
        /*
         * Call the setup graph helper after a timeout. this is required so that the graph is
         * completely refreshed so that only the active series will react to mouseover.
         */
        setTimeout(() => {
          this.drawGraphHelper(resolve);
        });
      } else {
        this.drawGraphHelper(resolve);
      }
    });
  }

  /**
   * @param resolve A promise that should be resolved after the graph is done rendering.
   */
  drawGraphHelper(resolve) {
    this.turnOffXAxisDecimals();
    this.turnOffYAxisDecimals();
    this.copyXAxisPlotBandsFromComponentContent();
    this.setupXAxisLimitSpacerWidth();
    let series = null;
    if (this.isTrialsEnabled()) {
      series = this.GraphService.getSeriesFromTrials(this.trials);
      this.xAxis.plotBands = this.GraphService.getPlotBandsFromTrials(this.trials);
    } else {
      series = this.getSeries();
    }
    if (this.activeSeries == null) {
      this.setDefaultActiveSeries();
    }
    if (this.isDisabled) {
      this.setCanEditForAllSeries(series, false);
    }
    this.showUndoButton = false;
    this.setAllSeriesFields(series);
    this.refreshSeriesIds(series);
    this.updateMinMaxAxisValues(series, this.xAxis, this.yAxis);
    this.xAxis.plotLines = this.plotLineManager.getXPlotLines();
    // Make a copy of the series so when the highcharts-chart modifies the series it won't modify
    // our original series in our trials. There was a problem that occurred when there were two
    // trials and the student hides the first trial which would cause the the data points in the
    // second trial to be written to the first trial. Making a copy of the series prevents this
    // problem. I think this problem occurs because highcharts-chart was expecting two series so
    // when we hide the first trial (and the first series), it moves the second series (from the
    // second trial) to the first series.
    series = copy(series);
    this.chartConfig = this.createChartConfig(
      resolve,
      this.title,
      this.subtitle,
      this.xAxis,
      this.yAxis,
      series
    );
    if (this.componentContent.useCustomLegend) {
      // use a timeout so the graph has a chance to render before we set the custom legend
      setTimeout(() => {
        if (!this.hasCustomLegendBeenSet) {
          this.setCustomLegend();
          this.hasCustomLegendBeenSet = true;
        }
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  turnOffXAxisDecimals() {
    this.xAxis.allowDecimals = false;
  }

  turnOffYAxisDecimals() {
    if (isSingleYAxis(this.yAxis)) {
      this.yAxis.allowDecimals = false;
    } else {
      this.yAxis.forEach((yAxis) => (yAxis.allowDecimals = false));
    }
  }

  copyXAxisPlotBandsFromComponentContent() {
    this.xAxis.plotBands = this.componentContent.xAxis.plotBands;
  }

  setupXAxisLimitSpacerWidth() {
    if (this.width > 100) {
      this.xAxisLimitSpacerWidth = this.width - 100;
    } else {
      this.xAxisLimitSpacerWidth = 0;
    }
  }

  refreshSeriesIds(series) {
    this.clearSeriesIds(series);
    this.setSeriesIds(series);
  }

  setAllSeriesFields(series) {
    for (const singleSeries of series) {
      this.setSingleSeriesFields(singleSeries);
    }
  }

  getNumberOfEditableSeries(series) {
    let numberOfEditableSeries = 0;
    for (const singleSeries of series) {
      if (singleSeries.canEdit) {
        numberOfEditableSeries++;
      }
    }
    return numberOfEditableSeries;
  }

  setSingleSeriesFields(singleSeries) {
    if (singleSeries.canEdit && this.isActiveSeries(singleSeries)) {
      singleSeries.dragDrop = {
        draggableX: true,
        draggableY: true
      };
      if (this.graphType === 'line' || this.graphType === 'scatter') {
        singleSeries.dragDrop.draggableX = true;
      } else if (this.graphType === 'column') {
        singleSeries.dragDrop.draggableX = false;
      }
      singleSeries.cursor = 'move';
      singleSeries.stickyTracking = false;
      singleSeries.shared = false;
      singleSeries.allowPointSelect = true;
      this.showUndoButton = true;
    } else {
      singleSeries.dragDrop = {
        draggableX: false,
        draggableY: false
      };
      delete singleSeries.cursor;
      singleSeries.cursor = 'auto';
      singleSeries.stickyTracking = false;
      singleSeries.shared = false;
      singleSeries.allowPointSelect = false;
    }
    if (singleSeries.allowPointMouseOver === true) {
      singleSeries.allowPointSelect = true;
    }
  }

  clearChartConfig() {
    this.chartConfig = {
      chart: {
        options: {
          chart: {}
        }
      }
    };
  }

  createChartConfig(resolve, title, subtitle, xAxis, yAxis, series) {
    const chartConfig = {
      legend: {
        enabled: this.isLegendEnabled
      },
      tooltip: {
        formatter: this.GraphService.createTooltipFormatter(
          xAxis,
          yAxis,
          this.componentContent.roundValuesTo
        )
      },
      chart: {
        width: this.width,
        height: this.height,
        type: this.graphType,
        plotBackgroundImage: this.backgroundImage,
        events: {
          load: function () {
            resolve(this);
          },
          click: this.createGraphClickHandler()
        }
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: false
          }
        }
      },
      plotOptions: {
        series: {
          dragSensitivity: 10,
          stickyTracking: false,
          events: {
            legendItemClick: this.createLegendItemClickHandler()
          },
          dragDrop: {
            draggableX: true,
            draggableY: true
          },
          point: {
            events: {
              drag: this.createPointDragEventHandler(),
              drop: this.createPointDropEventHandler()
            }
          }
        }
      },
      series: series,
      title: {
        text: title,
        useHTML: true
      },
      subtitle: {
        text: subtitle,
        useHTML: true
      },
      xAxis: xAxis,
      yAxis: yAxis,
      loading: false
    };
    return chartConfig;
  }

  isLimitXAxisType(xAxis) {
    return xAxis.type === 'limits' || xAxis.type == null;
  }

  isCategoriesXAxisType(xAxis) {
    return xAxis.type === 'categories';
  }

  createGraphClickHandler() {
    const thisGraphController = this;
    return function (event) {
      if (thisGraphController.graphType === 'line' || thisGraphController.graphType === 'scatter') {
        if (thisGraphController.isIgnoreClickEvent()) {
          return;
        } else {
          thisGraphController.handleGraphClickEvent(event, this.series);
        }
      }
    };
  }

  focusOnComponent(): void {
    // allows this component to listen to events (e.g. "keydown.backspace")
    this.hiddenButtonElement.nativeElement.focus();
  }

  /*
   * Check if the last drop event was within the last 100 milliseconds so we will not register the
   * click. We need to do this because when students drag points, a click event is fired when they
   * release the mouse button. we don't want that click event to create a new point so we need to
   * ignore it.
   */
  isIgnoreClickEvent() {
    const currentTime = new Date().getTime();
    return this.lastDropTime != null && currentTime - this.lastDropTime < 100;
  }

  handleGraphClickEvent(event, series) {
    if (!this.isDisabled) {
      const activeSeries = this.activeSeries;
      if (activeSeries != null && this.canEdit(activeSeries)) {
        const activeSeriesId = activeSeries.id;
        for (const singleSeries of series) {
          if (activeSeriesId === singleSeries.options.id && !singleSeries.visible) {
            // the series is not visible so we will not add the point
            alert(
              $localize`The series you are trying to add a point to is currently hidden. Please show the series by clicking the series name in the legend and try adding the point again.`
            );
            return;
          }
        }
        const x = this.performRounding(event.xAxis[0].value);
        const y = this.performRounding(this.getEventYValue(event));
        this.addPointToSeries(activeSeries, x, y);
        this.addNextComponentStateToUndoStack = true;
        this.studentDataChanged();
      } else {
        if (!this.plotLineManager.isShowMousePlotLine()) {
          // the student is trying to add a point to a series that can't be edited
          alert(
            $localize`You can not edit this series. Please choose a series that can be edited.`
          );
        }
      }
    }
  }

  getEventYValue(event) {
    return event.yAxis[this.getSeriesYAxisIndex(this.activeSeries)].value;
  }

  getSeriesYAxisIndex(series) {
    if (isMultipleYAxes(this.yAxis) && series.yAxis != null) {
      return series.yAxis;
    } else {
      return 0;
    }
  }

  createLegendItemClickHandler() {
    const thisGraphController = this;
    return function (event) {
      const canHideSeries =
        thisGraphController.componentContent.canStudentHideSeriesOnLegendClick === true;
      if (canHideSeries) {
        /*
         * Update the show field in all the series depending on whether each line is active
         * in the legend.
         */
        for (const yAxisSeries of this.yAxis.series) {
          let series = thisGraphController.getSeriesById(yAxisSeries.userOptions.id);
          if (this.userOptions.id === series.id) {
            series.show = !yAxisSeries.visible;
          } else {
            series.show = yAxisSeries.visible;
          }
        }
        thisGraphController.studentDataChanged();
      }
      return canHideSeries;
    };
  }

  createPointDragEventHandler() {
    const thisGraphController: any = this;
    return function (event) {
      if (!thisGraphController.isDisabled) {
        const activeSeries = thisGraphController.activeSeries;
        if (thisGraphController.canEdit(activeSeries)) {
          thisGraphController.dragging = true;
        }
      }
    };
  }

  createPointDropEventHandler() {
    const thisGraphController: any = this;
    return function (event) {
      // the student has stopped dragging the point and dropped the point
      if (!thisGraphController.isDisabled && thisGraphController.dragging) {
        const activeSeries = thisGraphController.activeSeries;
        thisGraphController.dragging = false;
        thisGraphController.lastDropTime = new Date().getTime();
        const target = event.target;
        const x = thisGraphController.performRounding(target.x);
        const y = thisGraphController.performRounding(target.y);
        const index = target.index;
        const data = activeSeries.data;
        if (thisGraphController.isLimitXAxisType(thisGraphController.xAxis)) {
          data[index] = [x, y];
        } else if (thisGraphController.isCategoriesXAxisType(thisGraphController.xAxis)) {
          data[index] = y;
        }
        thisGraphController.addNextComponentStateToUndoStack = true;
        thisGraphController.studentDataChanged();
      }
    };
  }

  createChartCallback() {
    const thisGraphController = this;
    return (chart) => {
      setTimeout(() => {
        thisGraphController.showXPlotLineIfOn('Drag Me');
        thisGraphController.showYPlotLineIfOn('Drag Me');
        if (
          thisGraphController.plotLineManager.isShowMouseXPlotLine() ||
          thisGraphController.plotLineManager.isShowMouseYPlotLine() ||
          thisGraphController.isSaveMouseOverPoints()
        ) {
          thisGraphController.setupMouseMoveListener();
        }
        chart.reflow();
        this.isLoaded = true;
      }, 500);
    };
  }

  private setCustomLegend(): void {
    new GraphCustomLegend(this.chartId, this.componentContent.customLegend).render();
  }

  addPointToSeries(series, x, y) {
    const data = series.data;
    if (this.isCategoriesXAxisType(this.componentContent.xAxis)) {
      data[x] = y;
    } else {
      data.push([x, y]);
      data.sort(this.sortPoints);
      series.data = this.makePointsUnique(data);
    }
  }

  sortPoints(pointA: any, pointB: any): number {
    return pointA[0] - pointB[0];
  }

  makePointsUnique(points: any[]): any[] {
    const xValuesFound = {};
    const uniquePoints = points.filter((point) => {
      const xValue = point[0];
      if (xValuesFound[xValue] == null) {
        xValuesFound[xValue] = true;
        return true;
      } else {
        return false;
      }
    });
    return uniquePoints;
  }

  canEdit(series) {
    return series.canEdit;
  }

  setSeries(series) {
    this.series = series;
  }

  getSeries() {
    return this.series;
  }

  setSeriesByIndex(series, index) {
    this.series[index] = series;
  }

  getSeriesByIndex(index) {
    return this.series[index];
  }

  setTrials(trials) {
    this.trials = trials;
  }

  /**
   * Get the index of the trial
   * @param trial the trial object
   * @return the index of the trial within the trials array
   */
  getTrialIndex(trial) {
    for (let t = 0; t < this.trials.length; t++) {
      const tempTrial = this.trials[t];
      if (trial === tempTrial) {
        return t;
      }
    }
    return -1;
  }

  setActiveTrialByIndex(index) {
    this.activeTrial = this.trials[index];
  }

  canEditTrial(trial) {
    let series = trial.series;
    for (const singleSeries of series) {
      if (singleSeries.canEdit) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set whether to show the active trial select menu
   * @return whether to show the active trial select menu
   */
  showSelectActiveTrials() {
    let editableTrials = 0;
    for (const trial of this.trials) {
      if (this.canEditTrial(trial) && trial.show) {
        editableTrials++;
        if (editableTrials > 1) {
          return true;
        }
      }
    }
    return false;
  }

  setXAxis(xAxis) {
    this.xAxis = copy(xAxis);
  }

  getXAxis() {
    return this.xAxis;
  }

  setYAxis(yAxis) {
    this.yAxis = copy(yAxis);
  }

  getYAxis() {
    return this.yAxis;
  }

  setActiveSeries(series) {
    this.activeSeries = series;
  }

  setActiveSeriesByIndex(index) {
    const series = this.getSeriesByIndex(index);
    if (series != null && series.yAxis == null) {
      series.yAxis = 0;
    }
    this.setActiveSeries(series);
  }

  resetSeries() {
    let confirmMessage = '';
    const seriesName = this.activeSeries.name;
    if (seriesName === '') {
      confirmMessage = $localize`Are you sure you want to reset the series?`;
    } else {
      confirmMessage = $localize`Are you sure you want to reset the "${seriesName}" series?`;
    }
    if (confirm(confirmMessage)) {
      this.resetSeriesHelper();
    }
  }

  resetSeriesHelper() {
    if (this.component.hasConnectedComponent()) {
      this.newTrial();
      const isReset = true;
      this.handleConnectedComponents(isReset);
    } else {
      const activeSeriesIndex = this.getSeriesIndex(this.activeSeries);
      let originalSeries = this.componentContent.series[activeSeriesIndex];
      if (originalSeries != null) {
        originalSeries = copy(originalSeries);
        this.setSeriesByIndex(originalSeries, activeSeriesIndex);
        this.setActiveSeriesByIndex(activeSeriesIndex);
        if (this.componentContent.xAxis != null) {
          this.setXAxis(this.componentContent.xAxis);
        }
        if (this.componentContent.yAxis != null) {
          this.setYAxis(this.componentContent.yAxis);
        }
        this.backgroundImage = this.componentContent.backgroundImage;
        this.addNextComponentStateToUndoStack = true;
        this.studentDataChanged();
      }
    }
  }

  setStudentWork(componentState) {
    const studentData = componentState.studentData;
    if (this.isStudentDataVersion1(studentData.version)) {
      this.studentDataVersion = 1;
      this.setSeries(copy(studentData.series));
    } else {
      this.studentDataVersion = studentData.version;
      if (studentData.trials != null && studentData.trials.length > 0) {
        const trialsCopy = copy(studentData.trials);
        this.setTrials(trialsCopy);
        const activeTrialIndex = studentData.activeTrialIndex;
        if (activeTrialIndex == null) {
          if (trialsCopy.length > 0) {
            this.setActiveTrialByIndex(studentData.trials.length - 1);
          }
        } else {
          this.setActiveTrialByIndex(activeTrialIndex);
        }
        if (this.activeTrial != null && this.activeTrial.series != null) {
          this.series = this.activeTrial.series;
        }
      }
    }
    this.setTrialIdsToShow();
    if (studentData.xAxis != null) {
      this.setXAxis(studentData.xAxis);
    }
    if (studentData.yAxis != null) {
      this.setYAxis(studentData.yAxis);
    }
    this.setActiveSeriesByIndex(studentData.activeSeriesIndex);
    if (studentData.backgroundImage != null) {
      this.backgroundImage = studentData.backgroundImage;
    }
    const submitCounter = studentData.submitCounter;
    if (submitCounter != null) {
      this.submitCounter = submitCounter;
    }
    if (studentData.mouseOverPoints != null && studentData.mouseOverPoints.length > 0) {
      this.mouseOverPoints = studentData.mouseOverPoints;
    }
    this.processLatestStudentWork();
  }

  activeSeriesChanged() {
    const useTimeoutSetupGraph = true;
    this.studentDataChanged(useTimeoutSetupGraph);
  }

  studentDataChanged(useTimeoutSetupGraph: boolean = false) {
    this.isDirty = true;
    this.emitComponentDirty(true);
    this.isSubmitDirty = true;
    this.emitComponentSubmitDirty(true);
    this.clearLatestComponentState();
    this.drawGraph(useTimeoutSetupGraph);
    /*
     * the student work in this component has changed so we will tell
     * the parent node that the student data will need to be saved.
     * this will also notify connected parts that this component's student
     * data has changed.
     */
    const action = 'change';
    this.createComponentState(action).then((componentState) => {
      if (this.addNextComponentStateToUndoStack) {
        if (this.previousComponentState != null) {
          this.undoStack.push(this.previousComponentState);
        }
        /*
         * Remember this current component state for the next time
         * studentDataChanged() is called. The next time
         * studentDataChanged() is called, this will be the previous
         * component state and we will add it to the undoStack. We do not
         * want to put the current component state onto the undoStack
         * because if the student clicks undo and this current component
         * state is on the top of the stack, the graph won't change.
         * Basically the undoStack contains the component states from the
         * current visit except for the current component state.
         */
        this.previousComponentState = componentState;
        this.addNextComponentStateToUndoStack = false;
      }
      /*
       * fire the componentStudentDataChanged event after a short timeout
       * so that the other component handleConnectedComponentStudentDataChanged()
       * listeners can initialize before this and are then able to process
       * this componentStudentDataChanged event
       */
      setTimeout(() => {
        this.emitComponentStudentDataChanged(componentState);
      }, 1000);
    });
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    const componentState = this.createNewComponentState();
    const studentData: any = {};
    studentData.version = this.studentDataVersion;
    if (this.isStudentDataVersion1()) {
      studentData.series = copy(this.getSeries());
    } else {
      if (this.trials != null) {
        studentData.trials = copy(this.trials);
        const activeTrialIndex = this.getTrialIndex(this.activeTrial);
        studentData.activeTrialIndex = activeTrialIndex;
      }
    }
    studentData.xAxis = copy(this.getXAxis());
    delete studentData.xAxis.plotBands;
    if (this.componentContent.xAxis != null && this.componentContent.xAxis.plotBands != null) {
      studentData.xAxis.plotBands = this.componentContent.xAxis.plotBands;
    }
    studentData.yAxis = this.getYAxis();
    const activeSeriesIndex = this.getSeriesIndex(this.activeSeries);
    if (activeSeriesIndex != null) {
      studentData.activeSeriesIndex = activeSeriesIndex;
    }
    const uploadedFileName = this.getUploadedFileName();
    if (uploadedFileName != null) {
      studentData.uploadedFileName = uploadedFileName;
    }
    if (this.backgroundImage != null) {
      studentData.backgroundImage = this.backgroundImage;
    }
    studentData.submitCounter = this.submitCounter;
    if (this.mouseOverPoints.length !== 0) {
      studentData.mouseOverPoints = this.mouseOverPoints;
    }
    componentState.isSubmit = this.isSubmit;
    componentState.studentData = studentData;
    componentState.componentType = 'Graph';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    this.isSubmit = false;
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  /**
   * Perform any additional processing that is required before returning the component state
   * Note: this function must call deferred.resolve() otherwise student work will not be saved
   * @param deferred a deferred object
   * @param componentState the component state
   * @param action the action that we are creating the component state for
   * e.g. 'submit', 'save', 'change'
   */
  createComponentStateAdditionalProcessing(deferred, componentState, action) {
    if (this.ProjectService.hasAdditionalProcessingFunctions(this.nodeId, this.componentId)) {
      const additionalProcessingFunctions = this.ProjectService.getAdditionalProcessingFunctions(
        this.nodeId,
        this.componentId
      );
      const allPromises = [];
      for (const additionalProcessingFunction of additionalProcessingFunctions) {
        const promise = new Promise((resolve, reject) => {
          additionalProcessingFunction(
            { resolve: resolve, reject: reject },
            componentState,
            action
          );
        });
        allPromises.push(promise);
      }
      Promise.all(allPromises).then(() => {
        deferred.resolve(componentState);
      });
    } else {
      deferred.resolve(componentState);
    }
  }

  getSeriesIndex(series) {
    const multipleSeries = this.getSeries();
    for (let s = 0; s < multipleSeries.length; s++) {
      const singleSeries = multipleSeries[s];
      if (series === singleSeries) {
        return s;
      }
    }
    return null;
  }

  getSeriesById(id) {
    for (const singleSeries of this.getSeries()) {
      if (singleSeries.id === id) {
        return singleSeries;
      }
    }
    return null;
  }

  /**
   * Get the trials from classmates
   * @param nodeId the node id
   * @param componentId the component id
   * @param showClassmateWorkSource Whether to get the work only from the
   * period the student is in or from all the periods. The possible values
   * are "period" or "class".
   * @return a promise that will return all the trials from the classmates
   */
  getTrialsFromClassmates(
    nodeId: string,
    componentId: string,
    periodId: number,
    showWorkNodeId: string,
    showWorkComponentId: string,
    showClassmateWorkSource: 'period' | 'class'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.GraphService.getClassmateStudentWork(
        nodeId,
        componentId,
        periodId,
        showWorkNodeId,
        showWorkComponentId,
        showClassmateWorkSource
      ).subscribe((componentStates: any[]) => {
        const promises = [];
        for (const componentState of componentStates) {
          promises.push(this.getTrialsFromComponentState(nodeId, componentId, componentState));
        }
        Promise.all(promises).then((promiseResults) => {
          const mergedTrials = [];
          for (const trials of promiseResults) {
            for (const trial of trials) {
              mergedTrials.push(trial);
            }
          }
          resolve(mergedTrials);
        });
      });
    });
  }

  /**
   * Get the trials from a component state.
   * Note: The code in this function doesn't actually require usage of a
   * promise. It's just the code that calls this function that utilizes
   * promise functionality. It's possible to refactor the code so that this
   * function doesn't need to return a promise.
   * @param nodeId the node id
   * @param componentId the component id
   * @param componentState the component state
   * @return a promise that will return the trials from the component state
   */
  getTrialsFromComponentState(nodeId, componentId, componentState) {
    const mergedTrials = [];
    const nodePositionAndTitle = this.ProjectService.getNodePositionAndTitle(nodeId);
    const studentData = componentState.studentData;
    if (this.isStudentDataVersion1(studentData.version)) {
      const series = studentData.series;
      const newTrial = {
        id: generateRandomKey(),
        name: nodePositionAndTitle,
        show: true,
        series: series
      };
      mergedTrials.push(newTrial);
    } else {
      const trials = studentData.trials;
      if (trials != null) {
        for (const trial of trials) {
          const newTrial = copy(trial);
          newTrial.name = nodePositionAndTitle;
          newTrial.show = true;
          mergedTrials.push(newTrial);
        }
      }
    }
    return Promise.resolve(mergedTrials);
  }

  /**
   * Convert the table data into series data
   * @param componentState the component state to get table data from
   * @param params (optional) the params to specify what columns
   * and rows to use from the table data
   */
  convertRowDataToSeriesData(rows, params) {
    const data = [];
    let skipFirstRow = this.getSkipFirstRowValue(params);
    let xColumn = this.getXColumnValue(params);
    let yColumn = this.getYColumnValue(params);
    for (let r = 0; r < rows.length; r++) {
      if (skipFirstRow && r === 0) {
        continue;
      }
      const row = rows[r];
      const xCell = row[xColumn];
      const yCell = row[yColumn];
      if (xCell != null && yCell != null) {
        addPointFromTableIntoData(xCell, yCell, data, null);
      }
    }
    return data;
  }

  getSkipFirstRowValue(params) {
    if (params == null) {
      return false;
    } else {
      return params.skipFirstRow;
    }
  }

  getXColumnValue(params) {
    if (params == null || params.xColumn == null) {
      return 0;
    } else {
      return params.xColumn;
    }
  }

  getYColumnValue(params) {
    if (params == null || params.yColumn == null) {
      return 1;
    } else {
      return params.yColumn;
    }
  }

  setSeriesIds(allSeries) {
    const usedSeriesIds = this.getAllUsedSeriesIds(allSeries);
    for (const singleSeries of allSeries) {
      if (singleSeries.id == null) {
        const nextSeriesId = this.getNextSeriesId(usedSeriesIds);
        singleSeries.id = nextSeriesId;
        usedSeriesIds.push(nextSeriesId);
      }
    }
  }

  getAllUsedSeriesIds(allSeries) {
    const usedSeriesIds = [];
    for (const singleSeries of allSeries) {
      usedSeriesIds.push(singleSeries.id);
    }
    return usedSeriesIds;
  }

  /**
   * Get the next available series id
   * @param usedSeriesIds an array of used series ids
   * @returns the next available series id
   */
  getNextSeriesId(usedSeriesIds) {
    let nextSeriesId = null;
    let currentSeriesNumber = 0;
    let foundNextSeriesId = false;
    while (!foundNextSeriesId) {
      const tempSeriesId = 'series-' + currentSeriesNumber;
      if (usedSeriesIds.indexOf(tempSeriesId) === -1) {
        nextSeriesId = tempSeriesId;
        foundNextSeriesId = true;
      } else {
        currentSeriesNumber++;
      }
    }
    return nextSeriesId;
  }

  getChartById(chartId) {
    for (const chart of Highcharts.charts) {
      if (chart != null && (chart as any).renderTo.id === chartId) {
        return chart;
      }
    }
    return null;
  }

  @HostListener('keydown.backspace')
  handleDeleteKeyPressed(): void {
    const series = this.activeSeries;
    if (this.canEdit(series)) {
      const selectedPoints = this.getSelectedPoints();
      let index = null;
      if (selectedPoints.length > 0) {
        const indexesToDelete = [];
        const data = series.data;
        for (const selectedPoint of selectedPoints) {
          index = selectedPoint.index;
          const dataPoint = data[index];
          if (dataPoint != null) {
            /*
             * make sure the x and y values match the selected point
             * that we are going to delete
             */
            if (dataPoint[0] === selectedPoint.x || dataPoint[1] === selectedPoint.y) {
              indexesToDelete.push(index);
            }
          }
        }
        /*
         * order the array from largest to smallest. we are doing this
         * so that we delete the points from the end first. if we delete
         * points starting from lower indexes first, then the indexes
         * will shift and we will end up deleting the wrong points.
         */
        indexesToDelete.sort().reverse();
        // loop through all the indexes and remove them from the series data
        for (let i = 0; i < indexesToDelete.length; i++) {
          data.splice(indexesToDelete[i], 1);
        }
        this.addNextComponentStateToUndoStack = true;
        this.studentDataChanged();
      }
    }
  }

  getSelectedPoints() {
    const chart = this.getChartById(this.chartId);
    return chart.getSelectedPoints();
  }

  isActiveSeries(series) {
    const seriesIndex = this.getSeriesIndex(series);
    return this.isActiveSeriesIndex(seriesIndex);
  }

  isActiveSeriesIndex(seriesIndex) {
    return this.series.indexOf(this.activeSeries) === seriesIndex;
  }

  isShowSelectSeriesInput() {
    return (
      this.trialIdsToShow.length &&
      this.hasEditableSeries() &&
      this.isSelectSeriesVisible &&
      this.series.length > 1
    );
  }

  newTrialButtonClicked() {
    this.newTrial();
    this.addNextComponentStateToUndoStack = true;
    this.studentDataChanged();
  }

  newTrial() {
    const activeSeriesIndex = this.getSeriesIndex(this.activeSeries);
    const trialNumbers = this.getTrialNumbers();
    let maxTrialNumber = 0;
    if (trialNumbers.length > 0) {
      maxTrialNumber = trialNumbers[trialNumbers.length - 1];
    }
    if (this.hideAllTrialsOnNewTrial) {
      for (const trial of this.trials) {
        trial.show = false;
      }
    }
    const series = copy(this.componentContent.series);
    const trial = {
      name: $localize`Trial` + ' ' + (maxTrialNumber + 1),
      series: series,
      show: true,
      id: generateRandomKey()
    };
    this.trials.push(trial);
    this.activeTrial = trial;
    this.series = series;
    if (this.activeSeries == null) {
      this.setDefaultActiveSeries();
    } else {
      this.setActiveSeriesByIndex(activeSeriesIndex);
    }
    this.setTrialIdsToShow();
  }

  getTrialNumbers() {
    const trialNumbers = [];
    const trialNumberRegex = /Trial (\d*)/;
    for (const trial of this.trials) {
      const tempTrialName = trial.name;
      const match = trialNumberRegex.exec(tempTrialName);
      if (match != null && match.length > 0) {
        const tempTrialNumber = match[1];
        trialNumbers.push(parseInt(tempTrialNumber));
      }
    }
    trialNumbers.sort();
    return trialNumbers;
  }

  deleteTrial(trialIndex) {
    const trialToRemove = this.trials[trialIndex];
    const trialToRemoveId = trialToRemove.id;
    this.trials.splice(trialIndex, 1);
    for (let t = 0; t < this.trialIdsToShow.length; t++) {
      if (trialToRemoveId === this.trialIdsToShow[t]) {
        this.trialIdsToShow.splice(t, 1);
      }
    }
    if (this.trials.length === 0) {
      // there are no more trials so we will create a new empty trial
      this.newTrial();
      this.setXAxis(this.componentContent.xAxis);
      this.setYAxis(this.componentContent.yAxis);
    } else if (this.trials.length > 0) {
      if (trialToRemove === this.activeTrial) {
        this.makeHighestTrialActive();
      }
    }
    this.setTrialIdsToShow();
    this.addNextComponentStateToUndoStack = true;
    this.studentDataChanged();
  }

  makeHighestTrialActive() {
    this.activeTrial = null;
    this.activeSeries = null;
    this.series = [];
    const highestTrial = this.getHighestTrial();
    if (highestTrial != null) {
      const seriesIndex = this.getSeriesIndex(this.activeSeries);
      this.activeTrial = highestTrial;
      this.setSeries(this.activeTrial.series);
      if (seriesIndex != null) {
        this.setActiveSeriesByIndex(seriesIndex);
      }
    }
  }

  getHighestTrial() {
    let highestTrialIndex = null;
    let highestTrial = null;
    for (const trialId of this.trialIdsToShow) {
      const trial = this.getTrialById(trialId);
      const trialIndex = this.getTrialIndex(trial);
      if (highestTrialIndex == null || trialIndex > highestTrialIndex) {
        highestTrialIndex = trialIndex;
        highestTrial = trial;
      }
    }
    return highestTrial;
  }

  activeTrialChanged() {
    const seriesIndex = this.getSeriesIndex(this.activeSeries);
    const activeTrial = this.activeTrial;
    this.series = activeTrial.series;
    this.setActiveSeriesByIndex(seriesIndex);
    this.addNextComponentStateToUndoStack = true;
    this.studentDataChanged();
  }

  trialIdsToShowChanged() {
    this.showOrHideTrials(this.trialIdsToShow);
    this.setActiveTrialAndSeriesByTrialIdsToShow(this.trialIdsToShow);
    // hack: for some reason, the ids to show model gets out of sync when deleting a trial, for example
    // TODO: figure out why this check is sometimes necessary and remove
    for (let a = 0; a < this.trialIdsToShow.length; a++) {
      const idToShow = this.trialIdsToShow[a];
      if (!this.getTrialById(idToShow)) {
        this.trialIdsToShow.splice(a, 1);
      }
    }
    /*
     * Make sure the trialIdsToShow has actually changed. Sometimes
     * trialIdsToShowChanged() gets called even if trialIdsToShow
     * does not change because the model for the trial checkbox
     * select is graphController.trials. This means trialIdsToShowChanged()
     * will be called when we replace the trials in createComponentState()
     * but this does not necessarily mean the trialIdsToShow has changed.
     * We do this check to minimize the number of times studentDataChanged()
     * is called.
     */
    if (
      this.previousTrialIdsToShow != null &&
      this.trialIdsToShow != null &&
      !arraysContainSameValues(this.previousTrialIdsToShow, this.trialIdsToShow)
    ) {
      this.trialIdsToShow = this.trialIdsToShow;
      this.studentDataChanged();
    }
    /*
     * Remember the trial ids to show so we can use it to make sure the
     * trialIdsToShow actually change the next time trialIdsToShowChanged()
     * is called.
     */
    this.previousTrialIdsToShow = copy(this.trialIdsToShow);
  }

  showOrHideTrials(trialIdsToShow) {
    for (const trial of this.trials) {
      if (trialIdsToShow.indexOf(trial.id) !== -1) {
        trial.show = true;
      } else {
        trial.show = false;
        if (this.activeTrial != null && this.activeTrial.id === trial.id) {
          this.activeTrial = null;
          this.activeSeries = null;
          this.series = [];
        }
      }
    }
  }

  setActiveTrialAndSeriesByTrialIdsToShow(trialIdsToShow) {
    if (trialIdsToShow.length > 0) {
      const lastShownTrialId = trialIdsToShow[trialIdsToShow.length - 1];
      const lastShownTrial = this.getTrialById(lastShownTrialId);
      if (this.hasEditableSeries(lastShownTrial.series)) {
        this.activeTrial = lastShownTrial;
        let seriesIndex = this.getSeriesIndex(this.activeSeries);
        if (!this.isSeriesEditable(this.activeTrial.series, seriesIndex)) {
          seriesIndex = this.getLatestEditableSeriesIndex(this.activeTrial.series);
        }
        this.setSeries(this.activeTrial.series);
        if (seriesIndex != null) {
          this.setActiveSeriesByIndex(seriesIndex);
        }
      }
    }
  }

  isSeriesEditable(multipleSeries, index) {
    if (multipleSeries[index] != null) {
      return multipleSeries[index].canEdit;
    }
    return false;
  }

  getLatestEditableSeriesIndex(multipleSeries) {
    for (let s = multipleSeries.length - 1; s >= 0; s--) {
      if (multipleSeries[s].canEdit) {
        return s;
      }
    }
    return null;
  }

  setTrialIdsToShow() {
    const idsToShow = [];
    for (const trial of this.trials) {
      if (trial.show) {
        idsToShow.push(trial.id);
      }
    }
    this.trialIdsToShow = idsToShow;
    this.previousTrialIdsToShow = idsToShow;
  }

  /**
   * Process the student data that we have received from a connected component.
   * @param studentData The student data from a connected component.
   * @param params The connected component params.
   */
  processConnectedComponentStudentData(studentData, params) {
    if (params.fields == null) {
      /*
       * we do not need to look at specific fields so we will directly
       * parse the the trial data from the student data.
       */
      if (this.hasTrial(studentData)) {
        this.parseLatestTrial(studentData, params);
      }
    } else {
      // we need to process specific fields in the student data
      for (const field of params.fields) {
        const name = field.name;
        const when = field.when;
        const action = field.action;
        if (when === 'always') {
          if (action === 'write') {
            // TODO
          } else if (action === 'read') {
            this.readConnectedComponentFieldFromStudentData(studentData, params, name);
          }
        } else if (when === 'firstTime') {
          if (action === 'write') {
            // TODO
          } else if (action === 'read') {
            // TODO
          }
        }
      }
    }
  }

  /**
   * Read the field from the new student data and perform any processing on our
   * existing student data based upon the new student data.
   * @param studentData The new student data from the connected component.
   * @param params The connected component params.
   * @param name The field name to read and process.
   */
  readConnectedComponentFieldFromStudentData(studentData, params, name) {
    if (name === 'selectedCells') {
      // only show the trials that are specified in the selectedCells array
      let selectedCells = studentData[name];
      if (selectedCells != null) {
        let selectedTrialIds = this.convertSelectedCellsToTrialIds(selectedCells);
        for (let trial of this.trials) {
          if (selectedTrialIds.includes(trial.id)) {
            trial.show = true;
          } else {
            trial.show = false;
          }
        }
      }
    } else if (name === 'trial' && this.hasTrial(studentData)) {
      this.parseLatestTrial(studentData, params);
    } else if (name === 'trialIdsToDelete') {
      this.deleteTrialsByTrialId(studentData.trialIdsToDelete);
    } else if (name === 'clearGraph' && studentData.clearGraph) {
      this.clearGraph();
    }
  }

  /**
   * Delete the trials
   * @param trialIdsToDelete An array of trial ids to delete
   */
  deleteTrialsByTrialId(trialIdsToDelete) {
    if (trialIdsToDelete != null) {
      for (let trialIdToDelete of trialIdsToDelete) {
        this.deleteTrialId(trialIdToDelete);
      }
    }
  }

  clearGraph() {
    this.trials = [];
    this.newTrial();
    this.resetSeriesHelper();
    this.drawGraph();
  }

  /**
   * Delete a trial
   * @param trialId The trial id string to delete
   */
  deleteTrialId(trialId) {
    for (let t = 0; t < this.trials.length; t++) {
      let trial = this.trials[t];
      if (trial.id === trialId) {
        this.trials.splice(t, 1);
        break;
      }
    }
  }

  /**
   * Parse the latest trial and set it into the component
   * @param studentData the student data object that has a trials field
   * @param params (optional) parameters that specify what to use from the
   * student data
   */
  parseLatestTrial(studentData, params) {
    const latestStudentDataTrial = this.getLatestStudentDataTrial(studentData);
    const latestStudentDataTrialId = latestStudentDataTrial.id;
    this.removeDefaultTrialIfNecessary(latestStudentDataTrialId);
    const latestTrial = this.createNewTrialIfNecessary(latestStudentDataTrialId);
    this.copySeriesIntoTrial(latestStudentDataTrial, latestTrial, studentData, params);
    this.copyTrialNameIntoTrial(latestStudentDataTrial, latestTrial);
    this.copyPlotBandsIntoTrial(latestStudentDataTrial, latestTrial);
    this.setLastTrialToActive();
    if (studentData.xPlotLine != null) {
      this.showXPlotLine(studentData.xPlotLine);
    }
    this.setTrialIdsToShow();
    this.activeTrialChanged();
  }

  getLatestStudentDataTrial(studentData) {
    let latestStudentDataTrial = null;
    if (studentData.trial != null) {
      latestStudentDataTrial = studentData.trial;
    }
    if (studentData.trials != null && studentData.trials.length > 0) {
      latestStudentDataTrial = studentData.trials[studentData.trials.length - 1];
    }
    return latestStudentDataTrial;
  }

  hasTrial(studentData: any): boolean {
    return (
      studentData.trial != null || (studentData.trials != null && studentData.trials.length > 0)
    );
  }

  hideAllTrials() {
    for (const trial of this.trials) {
      trial.show = false;
    }
  }

  createNewTrial(id) {
    return {
      id: id,
      name: '',
      series: [],
      show: true
    };
  }

  copySeries(series) {
    const newSeries: any = {
      name: series.name,
      data: series.data,
      color: series.color,
      canEdit: false,
      allowPointSelect: false
    };
    if (series.marker != null) {
      newSeries.marker = series.marker;
    }
    if (series.dashStyle != null) {
      newSeries.dashStyle = series.dashStyle;
    }
    if (series.allowPointMouseOver != null) {
      newSeries.allowPointMouseOver = series.allowPointMouseOver;
    }
    return newSeries;
  }

  removeDefaultTrialIfNecessary(latestStudentDataTrialId) {
    /*
     * remove the first default trial that is automatically created
     * when the student first visits the component otherwise there
     * will be a blank trial.
     */
    if (this.trials.length > 0) {
      const firstTrial = this.trials[0];
      /*
       * check if the trial has any series. if the trial doesn't
       * have any series it means it was automatically created by
       * the component.
       */
      if (this.isTrialHasEmptySeries(firstTrial)) {
        if (firstTrial.id == null || firstTrial.id !== latestStudentDataTrialId) {
          this.deleteFirstTrial(this.trials);
        }
      }
    }
  }

  isTrialHasEmptySeries(trial) {
    return trial.series == null || trial.series.length === 0 || this.isSeriesEmpty(trial.series);
  }

  isSeriesEmpty(series) {
    return series.length === 1 && series[0].data.length === 0;
  }

  deleteFirstTrial(trials) {
    trials.shift();
  }

  createNewTrialIfNecessary(trialId) {
    let trial = this.getTrialById(trialId);
    if (trial == null) {
      if (this.hideAllTrialsOnNewTrial) {
        this.hideAllTrials();
      }
      trial = this.createNewTrial(trialId);
      trial.show = true;
      this.setXAxis(this.componentContent.xAxis);
      this.setYAxis(this.componentContent.yAxis);
      this.trials.push(trial);
    }
    return trial;
  }

  copySeriesIntoTrial(oldTrial, newTrial, studentData, params) {
    newTrial.series = [];
    const series = oldTrial.series;
    for (let s = 0; s < series.length; s++) {
      if (this.isAddSeries(params, s)) {
        newTrial.series.push(this.copySeries(series[s]));
        if (params.highlightLatestPoint) {
          setTimeout(() => {
            this.highlightPointOnX(studentData.trial.id, studentData.xPointToHighlight);
          }, 1);
        }
      }
    }
  }

  isAddSeries(params, seriesIndex) {
    return (
      params == null ||
      params.seriesNumbers == null ||
      params.seriesNumbers.length === 0 ||
      (params.seriesNumbers != null && params.seriesNumbers.indexOf(seriesIndex) !== -1)
    );
  }

  copyTrialNameIntoTrial(oldTrial, newTrial) {
    if (oldTrial.name != null) {
      newTrial.name = oldTrial.name;
    }
  }

  copyPlotBandsIntoTrial(oldTrial, newTrial) {
    if (oldTrial.xAxis != null && oldTrial.xAxis.plotBands != null) {
      if (newTrial.xAxis == null) {
        newTrial.xAxis = {};
      }
      newTrial.xAxis.plotBands = oldTrial.xAxis.plotBands;
    }
  }

  setLastTrialToActive() {
    if (this.trials.length > 0) {
      this.activeTrial = this.trials[this.trials.length - 1];
      this.activeTrial.show = true;
    }
  }

  getTrialById(id) {
    for (const trial of this.trials) {
      if (trial.id === id) {
        return trial;
      }
    }
    return null;
  }

  hasEditableSeries(series = this.getSeries()) {
    for (const singleSeries of series) {
      if (singleSeries.canEdit) {
        return true;
      }
    }
    return false;
  }

  /**
   * Update the x and y axis min and max values if necessary to make sure
   * all points are visible in the graph view.
   * @param series the an array of series
   * @param xAxis the x axis object
   * @param yAxis the y axis object
   */
  updateMinMaxAxisValues(series, xAxis, yAxis) {
    const minMaxValues = this.getMinMaxValues(series);
    this.updateXAxisMinMaxIfNecessary(xAxis, minMaxValues);
    this.updateYAxisMinMaxIfNecessary(yAxis, minMaxValues);
  }

  updateXAxisMinMaxIfNecessary(xAxis, minMaxValues) {
    if (xAxis != null && !xAxis.locked) {
      if (minMaxValues.xMin < xAxis.min) {
        // set the value to null so highcharts will automatically set the value
        xAxis.min = null;
        xAxis.minPadding = 0.2;
      }
      if (minMaxValues.xMax >= xAxis.max) {
        // set the value to null so highcharts will automatically set the value
        xAxis.max = null;
        xAxis.maxPadding = 0.2;
      }
    }
  }

  updateYAxisMinMaxIfNecessary(yAxis, minMaxValues) {
    if (yAxis != null && !yAxis.locked) {
      if (minMaxValues.yMin < yAxis.min) {
        // set the value to null so highcharts will automatically set the value
        yAxis.min = null;
        yAxis.minPadding = 0.2;
      }
      if (minMaxValues.yMax >= yAxis.max) {
        // set the value to null so highcharts will automatically set the value
        yAxis.max = null;
        yAxis.maxPadding = 0.2;
      }
    }
  }

  getMinMaxValues(series) {
    let xMin = 0;
    let xMax = 0;
    let yMin = 0;
    let yMax = 0;
    for (const singleSeries of series) {
      const data = singleSeries.data;
      for (const dataPoint of data) {
        if (dataPoint != null) {
          let tempX = null;
          let tempY = null;
          if (dataPoint.constructor.name === 'Object') {
            tempX = dataPoint.x;
            tempY = dataPoint.y;
          } else if (dataPoint.constructor.name === 'Array') {
            tempX = dataPoint[0];
            tempY = dataPoint[1];
          } else if (dataPoint.constructor.name === 'Number') {
            tempY = dataPoint;
          }
          if (tempX > xMax) {
            xMax = tempX;
          }
          if (tempX < xMin) {
            xMin = tempX;
          }
          if (tempY > yMax) {
            yMax = tempY;
          }
          if (tempY < yMin) {
            yMin = tempY;
          }
        }
      }
    }
    const result = {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    };
    return result;
  }

  clearSeriesIds(series) {
    for (const singleSeries of series) {
      singleSeries.id = null;
    }
  }

  snipGraph() {
    const chart: any = this.getChartById(this.chartId);
    const svgString = chart.getSVG();
    const hiddenCanvas: any = document.getElementById(this.hiddenCanvasId);
    canvg(hiddenCanvas, svgString, {
      renderCallback: () => {
        const pngFile = convertToPNGFile(hiddenCanvas);
        this.NotebookService.addNote(this.StudentDataService.getCurrentNodeId(), pngFile);
      }
    });
  }

  readCSVIntoActiveSeries(csvString) {
    const lines = csvString.split(/\r\n|\n/);
    this.activeSeries.data = [];
    for (const line of lines) {
      const values = line.split(',');
      const x = parseFloat(values[0]);
      const y = parseFloat(values[1]);
      if (!isNaN(x) && !isNaN(y)) {
        const dataPoint = [x, y];
        this.activeSeries.data.push(dataPoint);
      }
    }
  }

  setUploadedFileName(fileName) {
    this.uploadedFileName = fileName;
  }

  getUploadedFileName() {
    return this.uploadedFileName;
  }

  performRounding(number: number): number {
    return this.GraphService.performRounding(number, this.componentContent.roundValuesTo);
  }

  /**
   * Set the active series to the first series that the student can edit
   * or if there are no series the student can edit, set the active series
   * to the first series.
   */
  setDefaultActiveSeries() {
    for (let s = 0; s < this.series.length; s++) {
      const singleSeries = this.series[s];
      if (singleSeries.canEdit) {
        this.setActiveSeriesByIndex(s);
        break;
      }
    }
    if (this.activeSeries == null && this.series.length > 0) {
      /*
       * we did not find any series that the student can edit so we will
       * just set the active series to be the first series
       */
      this.setActiveSeriesByIndex(0);
    }
  }

  /**
   * Import any work we need from connected components
   * @param {boolean} isReset (optional) Whether this function call was
   * triggered by the student clicking the reset button.
   */
  handleConnectedComponents(isReset: boolean = false) {
    /*
     * This will hold all the promises that will return the trials that we want. The trials will
     * either be from this student or from classmates.
     */
    const promises = [];
    /*
     * this will end up containing the background from the last
     * connected component
     */
    let connectedComponentBackgroundImage = null;
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const type = connectedComponent.type;
      if (type === 'showClassmateWork') {
        connectedComponentBackgroundImage = this.handleShowClassmateWorkConnectedComponent(
          connectedComponent,
          promises
        );
      } else if (type === 'showWork' || type === 'importWork' || type == null) {
        connectedComponentBackgroundImage = this.handleShowOrImportWorkConnectedComponent(
          connectedComponent,
          promises
        );
      }
    }

    /*
     * wait for all the promises to resolve because we may need to request the classmate work from
     * the server
     */
    Promise.all(promises).then(
      this.handleConnectedComponentPromiseResults(connectedComponentBackgroundImage, isReset)
    );
  }

  handleShowClassmateWorkConnectedComponent(connectedComponent, promises) {
    const nodeId = connectedComponent.nodeId;
    const componentId = connectedComponent.componentId;
    let connectedComponentBackgroundImage = null;
    this.isDisabled = true;
    if (this.ConfigService.isPreview()) {
      const latestComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        nodeId,
        componentId
      );
      if (latestComponentState != null) {
        promises.push(this.getTrialsFromComponentState(nodeId, componentId, latestComponentState));
        if (
          latestComponentState != null &&
          latestComponentState.studentData != null &&
          latestComponentState.studentData.backgroundImage != null
        ) {
          connectedComponentBackgroundImage = latestComponentState.studentData.backgroundImage;
        }
      }
    } else {
      promises.push(
        this.getTrialsFromClassmates(
          this.nodeId,
          this.componentId,
          this.ConfigService.getPeriodId(),
          nodeId,
          componentId,
          connectedComponent.showClassmateWorkSource
        )
      );
      let component = this.ProjectService.getComponent(nodeId, componentId) as GraphContent;
      component = this.ProjectService.injectAssetPaths(component);
      connectedComponentBackgroundImage = component.backgroundImage;
    }
    return connectedComponentBackgroundImage;
  }

  handleShowOrImportWorkConnectedComponent(connectedComponent, promises) {
    const nodeId = connectedComponent.nodeId;
    const componentId = connectedComponent.componentId;
    let connectedComponentBackgroundImage = null;
    let latestComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (latestComponentState != null) {
      if (
        latestComponentState.componentType === 'ConceptMap' ||
        latestComponentState.componentType === 'Draw' ||
        latestComponentState.componentType === 'Label'
      ) {
        const connectedComponentOfComponentState = this.component.getConnectedComponent(
          latestComponentState.nodeId,
          latestComponentState.componentId
        );
        if (connectedComponentOfComponentState.importWorkAsBackground === true) {
          promises.push(this.setComponentStateAsBackgroundImage(latestComponentState));
        }
      } else {
        if (connectedComponent.type === 'showWork') {
          latestComponentState = copy(latestComponentState);
          const canEdit = false;
          this.setCanEditForAllSeriesInComponentState(latestComponentState, canEdit);
        }
        promises.push(this.getTrialsFromComponentState(nodeId, componentId, latestComponentState));
        if (
          latestComponentState != null &&
          latestComponentState.studentData != null &&
          latestComponentState.studentData.backgroundImage != null
        ) {
          connectedComponentBackgroundImage = latestComponentState.studentData.backgroundImage;
        }
        if (connectedComponent.importGraphSettings) {
          const component = this.ProjectService.getComponent(
            connectedComponent.nodeId,
            connectedComponent.componentId
          );
          this.importGraphSettings(component, latestComponentState);
        }
      }
    }
    return connectedComponentBackgroundImage;
  }

  importGraphSettings(component, componentState) {
    this.title = component.title;
    this.subtitle = component.subtitle;
    this.width = component.width;
    this.height = component.height;
    this.xAxis = componentState.studentData.xAxis;
    this.yAxis = componentState.studentData.yAxis;
  }

  handleConnectedComponentPromiseResults(connectedComponentBackgroundImage, isReset) {
    return (promiseResults) => {
      if (promiseResults.length > 0) {
        /*
         * First we will accumulate all the trials into one new component state and then we will
         * perform connected component processing.
         */
        const mergedTrials = [];
        /*
         * Loop through all the promise results. There will be a promise result for each component we
         * are importing from. Each promiseResult is an array of trials or an image url.
         */
        let trialCount = 0;
        let activeTrialIndex = 0;
        let activeSeriesIndex = 0;
        for (const promiseResult of promiseResults) {
          if (promiseResult instanceof Array) {
            const trials = promiseResult;
            for (const trial of trials) {
              if (this.canEditTrial(trial)) {
                activeTrialIndex = trialCount;
              }
              mergedTrials.push(trial);
              trialCount++;
            }
          } else if (typeof promiseResult === 'string') {
            connectedComponentBackgroundImage = promiseResult;
          }
        }
        if (this.isTrialsEnabled()) {
          activeTrialIndex = this.addTrialFromThisComponentIfNecessary(
            mergedTrials,
            trialCount,
            activeTrialIndex
          );
        }
        let newComponentState = this.createNewComponentState();
        newComponentState.studentData = {
          trials: mergedTrials,
          activeTrialIndex: activeTrialIndex,
          activeSeriesIndex: activeSeriesIndex,
          version: 2
        };
        if (
          this.componentContent.backgroundImage != null &&
          this.componentContent.backgroundImage !== ''
        ) {
          newComponentState.studentData.backgroundImage = this.componentContent.backgroundImage;
        } else if (connectedComponentBackgroundImage != null) {
          newComponentState.studentData.backgroundImage = connectedComponentBackgroundImage;
        }
        newComponentState = this.handleConnectedComponentsHelper(newComponentState, isReset);
        this.setStudentWork(newComponentState);
        this.studentDataChanged();
      }
    };
  }

  addTrialFromThisComponentIfNecessary(mergedTrials, trialCount, activeTrialIndex) {
    if (this.componentContent.series.length > 0) {
      const trial = this.createNewTrial(generateRandomKey());
      trial.name = $localize`Trial` + ' ' + trialCount;
      trial.series = copy(this.componentContent.series);
      mergedTrials.push(trial);
      if (this.canEditTrial(trial)) {
        activeTrialIndex = trialCount;
      }
    }
    return activeTrialIndex;
  }

  /**
   * Create an image from a component state and set the image as the background.
   * @param componentState A component state.
   * @return A promise that returns the url of the image that is generated from the component state.
   */
  setComponentStateAsBackgroundImage(componentState) {
    return this.generateImageFromComponentState(componentState).then((image) => {
      return image.url;
    });
  }

  /**
   * Perform additional connected component processing.
   * @param newComponentState The new component state generated by accumulating the trials from all
   * the connected component student data.
   */
  handleConnectedComponentsHelper(newComponentState, isReset) {
    let mergedComponentState = this.componentState;
    let firstTime = true;
    if (
      mergedComponentState == null ||
      isReset ||
      !this.GraphService.componentStateHasStudentWork(mergedComponentState)
    ) {
      mergedComponentState = newComponentState;
    } else {
      /*
       * This component has previous student data so this is not the first time this component is
       * being loaded.
       */
      firstTime = false;
    }
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const nodeId = connectedComponent.nodeId;
      const componentId = connectedComponent.componentId;
      const type = connectedComponent.type;
      if (type === 'showClassmateWork') {
        mergedComponentState = newComponentState;
      } else if (type === 'importWork' || type == null) {
        const connectedComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
          nodeId,
          componentId
        );
        const fields = connectedComponent.fields;
        if (connectedComponentState != null) {
          if (connectedComponentState.componentType !== 'Graph') {
            mergedComponentState = this.mergeComponentState(
              mergedComponentState,
              connectedComponentState,
              fields,
              firstTime
            );
          }
        } else {
          mergedComponentState = this.mergeNullComponentState(
            mergedComponentState,
            fields,
            firstTime
          );
        }
      }
    }
    if (mergedComponentState.studentData.version == null) {
      mergedComponentState.studentData.version = this.studentDataVersion;
    }
    if (newComponentState.studentData.backgroundImage != null) {
      mergedComponentState.studentData.backgroundImage =
        newComponentState.studentData.backgroundImage;
    }
    return mergedComponentState;
  }

  /**
   * Merge the component state from the connected component into the component
   * state from this component.
   * @param baseComponentState The component state from this component.
   * @param connectedComponentState The component state from the connected component.
   * @param mergeFields (optional) An array of objects that specify which fields
   * to look at in the connectedComponentState. Each object can contain 3 fields which
   * are "name", "when", "action".
   * - "name" is the name of the field in the connectedComponentState.studentData object
   *   For example, if connectedComponentState is from a Graph component, we may author the value to be "trials"
   * - "when" possible values
   *     "firstTime" means we merge the "name" field only the first time we visit the component
   *     "always" means we merge the "name" field every time we visit the component
   * - "action" possible values
   *     "read" means we look at the value of the "name" field and perform processing on it to generate
   *       some value that we will set into the baseComponentState
   *     "write" means we copy the value of the "name" field from connectedComponentState.studentData to
   *       baseComponentState.studentData
   * @param firstTime Whether this is the first time this component is being
   * visited.
   * @return The merged component state.
   */
  mergeComponentState(baseComponentState, connectedComponentState, mergeFields, firstTime) {
    if (mergeFields == null) {
      if (connectedComponentState.componentType === 'Graph' && firstTime) {
        // there are no merge fields specified so we will get all of the fields
        baseComponentState.studentData = copy(connectedComponentState.studentData);
      }
    } else {
      // we will merge specific fields
      for (const mergeField of mergeFields) {
        const name = mergeField.name;
        const when = mergeField.when;
        const action = mergeField.action;
        if (when === 'firstTime' && firstTime) {
          if (action === 'write') {
            baseComponentState.studentData[name] = connectedComponentState.studentData[name];
          } else if (action === 'read') {
            // TODO
          }
        } else if (when === 'always') {
          if (action === 'write') {
            baseComponentState.studentData[name] = connectedComponentState.studentData[name];
          } else if (action === 'read') {
            this.readConnectedComponentField(baseComponentState, connectedComponentState, name);
          }
        }
      }
    }
    return baseComponentState;
  }

  /**
   * We want to merge the component state from the connected component into this
   * component but the connected component does not have any work. We will
   * instead use default values.
   * @param baseComponentState The component state from this component.
   * @param mergeFields (optional) An array of objects that specify which fields
   * to look at. (see comment for mergeComponentState() for more information).
   * @param firstTime Whether this is the first time this component is being
   * visited.
   * @return The merged component state.
   */
  mergeNullComponentState(baseComponentState, mergeFields, firstTime) {
    if (mergeFields == null) {
      // TODO
    } else {
      for (const mergeField of mergeFields) {
        const name = mergeField.name;
        const when = mergeField.when;
        const action = mergeField.action;
        if (when === 'firstTime' && firstTime == true) {
          if (action === 'write') {
            // TODO
          } else if (action === 'read') {
            // TODO
          }
        } else if (when === 'always') {
          if (action === 'write') {
            // TODO
          } else if (action === 'read') {
            const connectedComponentState = null;
            this.readConnectedComponentField(baseComponentState, connectedComponentState, name);
          }
        }
      }
    }
    return baseComponentState;
  }

  /**
   * Read the field from the connected component's component state.
   * @param baseComponentState The component state from this component.
   * @param connectedComponentState The component state from the connected component.
   * @param field The field to look at in the connected component's component
   * state.
   */
  readConnectedComponentField(baseComponentState, connectedComponentState, field) {
    if (field === 'selectedCells') {
      if (connectedComponentState == null) {
        // we will default to hide all the trials
        for (const trial of baseComponentState.studentData.trials) {
          trial.show = false;
        }
      } else {
        // loop through all the trials and show the ones that are in the selected cells array
        const studentData = connectedComponentState.studentData;
        const selectedCells = studentData[field];
        const selectedTrialIds = this.convertSelectedCellsToTrialIds(selectedCells);
        for (const trial of baseComponentState.studentData.trials) {
          if (selectedTrialIds.includes(trial.id)) {
            trial.show = true;
          } else {
            trial.show = false;
          }
        }
      }
    } else if (field === 'trial') {
      // TODO
    }
  }

  setCanEditForAllSeriesInComponentState(componentState, canEdit) {
    for (const trial of componentState.studentData.trials) {
      this.setCanEditForAllSeries(trial.series, canEdit);
    }
  }

  setCanEditForAllSeries(series, canEdit) {
    for (const singleSeries of series) {
      singleSeries.canEdit = canEdit;
    }
  }

  undoClicked() {
    if (this.undoStack.length > 0) {
      const previousComponentState = this.undoStack.pop();
      this.setStudentWork(previousComponentState);
      this.previousComponentState = previousComponentState;
      this.drawGraph();
    } else if (this.initialComponentState == null) {
      this.previousComponentState = null;
      this.trials = [];
      this.newTrial();
      this.resetSeriesHelper();
      this.drawGraph();
    }
  }

  trialCheckboxClicked() {
    this.addNextComponentStateToUndoStack = true;
  }

  isSaveMouseOverPoints() {
    return this.componentContent.saveMouseOverPoints;
  }

  getXValueFromDataPoint(dataPoint) {
    if (dataPoint.constructor.name === 'Object') {
      return dataPoint.x;
    } else if (dataPoint.constructor.name === 'Array') {
      return dataPoint[0];
    }
    return null;
  }

  getYValueFromDataPoint(dataPoint) {
    if (dataPoint.constructor.name === 'Object') {
      return dataPoint.y;
    } else if (dataPoint.constructor.name === 'Array') {
      return dataPoint[1];
    }
    return null;
  }

  getLatestMouseOverPointX() {
    if (this.mouseOverPoints.length > 0) {
      return this.getXValueFromDataPoint(this.mouseOverPoints[this.mouseOverPoints.length - 1]);
    }
    return null;
  }

  getLatestMouseOverPointY() {
    if (this.mouseOverPoints.length > 0) {
      return this.getYValueFromDataPoint(this.mouseOverPoints[this.mouseOverPoints.length - 1]);
    }
    return null;
  }

  showXPlotLineIfOn(text = null) {
    if (this.plotLineManager.isShowMouseXPlotLine()) {
      let x = this.getLatestMouseOverPointX();
      if (x == null) {
        x = 0;
      }
      this.showXPlotLine(x, text);
    }
  }

  showYPlotLineIfOn(text = null) {
    if (this.plotLineManager.isShowMouseYPlotLine()) {
      let y = this.getLatestMouseOverPointY();
      if (y == null) {
        y = 0;
      }
      this.plotLineManager.showYPlotLine(this.getChartById(this.chartId), y, text);
    }
  }

  highlightPointOnX(seriesId, x) {
    const chart = this.getChartById(this.chartId);
    if (chart.series.length > 0) {
      let series = null;
      if (seriesId == null) {
        series = chart.series[chart.series.length - 1];
      } else {
        for (const singleSeries of chart.series) {
          if (singleSeries.userOptions.name === seriesId) {
            series = singleSeries;
          }
          this.removeHoverStateFromPoints(singleSeries.points);
        }
      }
      this.setHoverStateOnPoint(series.points, x);
    }
  }

  removeHoverStateFromPoints(points) {
    for (const point of points) {
      point.setState('');
    }
  }

  setHoverStateOnPoint(points, x) {
    for (const point of points) {
      if (point.x === x) {
        point.setState('hover');
      }
    }
  }

  convertSelectedCellsToTrialIds(selectedCells) {
    const selectedTrialIds = [];
    if (selectedCells != null) {
      for (const selectedCell of selectedCells) {
        const material = selectedCell.material;
        const bevTemp = selectedCell.bevTemp;
        const airTemp = selectedCell.airTemp;
        const selectedTrialId = material + '-' + bevTemp + 'Liquid';
        selectedTrialIds.push(selectedTrialId);
      }
    }
    return selectedTrialIds;
  }

  isTrialsEnabled() {
    return this.componentContent.enableTrials === true;
  }

  isStudentDataVersion1(version: number = null) {
    if (version == null) {
      return this.studentDataVersion == null || this.studentDataVersion === 1;
    } else {
      return version === 1;
    }
  }

  private showXPlotLine(x: number, text: string = ''): void {
    this.plotLineManager.showXPlotLine(this.getChartById(this.chartId), x, text);
    this.drawRectangleIfNecessary(x);
  }

  private drawRectangleIfNecessary(x: number): void {
    if (this.componentContent.highlightXRangeFromZero) {
      const chart = this.getChartById(this.chartId);
      this.drawRangeRectangle(0, x, chart.yAxis[0].min, chart.yAxis[0].max);
    }
  }
}
