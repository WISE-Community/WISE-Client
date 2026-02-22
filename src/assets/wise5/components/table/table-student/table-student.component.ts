import html2canvas from 'html2canvas';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { Tabulator } from 'tabulator-tables';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { TableService } from '../tableService';
import { MatDialog } from '@angular/material/dialog';
import { TabulatorData } from '../TabulatorData';
import { TabulatorDataService } from '../tabulatorDataService';
import { copy } from '../../../common/object/object';
import { convertToPNGFile } from '../../../common/canvas/canvas';
import { hasConnectedComponent } from '../../../common/ComponentContent';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { ComponentSaveSubmitButtonsComponent } from '../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../../directives/componentAnnotations/component-annotations.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    ComponentHeaderComponent,
    MatButton,
    MatIcon,
    TabulatorTableComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    MatInput,
    ComponentSaveSubmitButtonsComponent,
    ComponentAnnotationsComponent
  ],
  styles: ['.tools { margin-bottom: 8px; }'],
  templateUrl: 'table-student.component.html'
})
export class TableStudentComponent extends ComponentStudent {
  columnIndexToIsUsed: Map<number, boolean> = new Map();
  columnNames: string[];
  dataExplorerColumnToIsDisabled: any = {};
  dataExplorerGraphTypes: any[];
  dataExplorerGraphType: string;
  dataExplorerSeries: any[];
  dataExplorerSeriesParams: any[];
  dataExplorerTooltipHeaderColumn: number;
  dataExplorerXAxisLabel: string;
  dataExplorerXColumn: number;
  dataExplorerYAxisLabel: string;
  dataExplorerYAxisLabels: string[];
  isDataExplorerEnabled: boolean;
  isDataExplorerScatterPlotRegressionLineEnabled: boolean;
  protected resetTableButtonVisible: boolean;
  latestConnectedComponentParams: any;
  latestConnectedComponentState: any;
  notebookConfig: any;
  numDataExplorerSeries: number;
  selectedRowIndices: number[] = [];
  sortOrder: number[] = [];
  tableData: any;
  tableId: string;
  tabulatorData: TabulatorData;
  tabulatorSorters: any[] = [];

  constructor(
    protected annotationService: AnnotationService,
    private changeDetectorRef: ChangeDetectorRef,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    private tableService: TableService,
    private tabulatorDataService: TabulatorDataService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    // holds the the table data
    this.tableData = null;

    // the label for the notebook in thos project
    this.notebookConfig = this.notebookService.getNotebookConfig();

    this.latestConnectedComponentState = null;
    this.latestConnectedComponentParams = null;

    this.tableId = this.tableService.getTableId(this.nodeId, this.componentId);

    this.isDataExplorerEnabled = this.componentContent.isDataExplorerEnabled;
    if (this.isDataExplorerEnabled) {
      this.initializeDataExplorer();
    }

    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;

    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      // we will show work from another component
      this.handleConnectedComponents();
    } else if (
      this.tableService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      // the student has work so we will populate the work into this component
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      // we will import work from another component
      this.handleConnectedComponents();
    } else if (this.componentState == null) {
      // check if we need to import work

      if (this.component.hasConnectedComponent()) {
        /*
         * the student does not have any work and there are connected
         * components so we will get the work from the connected
         * components
         */
        this.handleConnectedComponents();
      }
    }

    this.setupTable();

    if (this.isDataExplorerEnabled) {
      this.updateColumnNames();
      if (this.componentState == null) {
        this.createDataExplorerSeries();
      } else {
        this.repopulateDataExplorerData(this.componentState);
      }
      if (this.componentContent.dataExplorerDataToColumn != null) {
        this.setDataExplorerDataToColumn();
      }
      this.updateColumnsUsed();
    }

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }

    this.resetTableButtonVisible = this.tableService.componentHasEditableCells(
      this.componentContent
    );
    this.disableComponentIfNecessary();

    if (this.isDataExplorerEnabled && this.componentContent.dataExplorerDataToColumn != null) {
      setTimeout(() => {
        this.studentDataChanged();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  initializeDataExplorer() {
    this.numDataExplorerSeries = this.componentContent.numDataExplorerSeries;
    this.dataExplorerGraphTypes = this.componentContent.dataExplorerGraphTypes;
    if (this.dataExplorerGraphTypes.length > 0) {
      this.dataExplorerGraphType = this.dataExplorerGraphTypes[0].value;
    }
    this.isDataExplorerScatterPlotRegressionLineEnabled =
      this.componentContent.isDataExplorerScatterPlotRegressionLineEnabled;
    this.dataExplorerYAxisLabels = Array(this.componentContent.numDataExplorerYAxis).fill('');
    this.dataExplorerSeriesParams = this.componentContent.dataExplorerSeriesParams;
    this.dataExplorerTooltipHeaderColumn = this.componentContent.dataExplorerTooltipHeaderColumn;
  }

  setDataExplorerDataToColumn(): void {
    for (let index = 0; index < this.dataExplorerSeries.length; index++) {
      const xColumn = this.getDataExplorerDataToColumn('x');
      if (xColumn != null) {
        this.setXDataToColumn(index, xColumn);
      }
      const yColumn = this.getDataExplorerYDataColumn(index + 1);
      if (yColumn != null) {
        this.setYDataToColumn(index, yColumn);
      }
    }
  }

  setXDataToColumn(dataExplorerSeriesIndex: number, columnIndex: number): void {
    this.dataExplorerSeries[dataExplorerSeriesIndex].xColumn = columnIndex;
    this.dataExplorerXColumn = columnIndex;
    this.setDataExplorerXColumnIsDisabled();
    this.updateDataExplorerXAxisLabel(columnIndex);
  }

  isDataExplorerXAxisLabelEmpty(): boolean {
    return this.dataExplorerXAxisLabel == null || this.dataExplorerXAxisLabel === '';
  }

  updateDataExplorerXAxisLabel(columnIndex: number): void {
    this.dataExplorerXAxisLabel = this.columnNames[columnIndex];
  }

  setYDataToColumn(dataExplorerSeriesIndex: number, columnIndex: number): void {
    this.dataExplorerSeries[dataExplorerSeriesIndex].yColumn = columnIndex;
    this.dataExplorerSeries[dataExplorerSeriesIndex].name = this.columnNames[columnIndex];
    this.setDataExplorerYColumnIsDisabled(dataExplorerSeriesIndex + 1);
    if (this.isDataExplorerYAxisLabelEmpty(dataExplorerSeriesIndex)) {
      this.updateDataExplorerYAxisLabel(dataExplorerSeriesIndex, columnIndex);
    }
  }

  isDataExplorerYAxisLabelEmpty(dataExplorerSeriesIndex: number): boolean {
    let yAxisLabel = '';
    if (this.isDataExplorerOneYAxis()) {
      yAxisLabel = this.dataExplorerYAxisLabel;
    } else {
      yAxisLabel =
        this.dataExplorerYAxisLabels[this.dataExplorerSeriesParams[dataExplorerSeriesIndex].yAxis];
    }
    return yAxisLabel == null || yAxisLabel === '';
  }

  updateDataExplorerYAxisLabel(dataExplorerSeriesIndex: number, columnIndex: number): void {
    const columnName = this.columnNames[columnIndex];
    if (this.isDataExplorerOneYAxis()) {
      this.dataExplorerYAxisLabel = columnName;
    } else {
      const yAxisIndex = this.dataExplorerSeries[dataExplorerSeriesIndex].yAxis;
      this.dataExplorerYAxisLabels[yAxisIndex] = columnName;
    }
  }

  /**
   * @param ySeriesNumber (1 indexed)
   * @return The column index (0 indexed)
   */
  private getDataExplorerYDataColumn(ySeriesNumber: number): number {
    if (ySeriesNumber === 1) {
      return this.getDataExplorerDataToColumn('y');
    } else {
      return this.getDataExplorerDataToColumn(`y${ySeriesNumber}`);
    }
  }

  /**
   * @param dataLabel The data label such as x, y, y2, y3, etc.
   * @return The column index (0 indexed)
   */
  getDataExplorerDataToColumn(dataLabel: string): number {
    return this.componentContent.dataExplorerDataToColumn[dataLabel];
  }

  setDataExplorerXColumnIsDisabled(): void {
    this.dataExplorerColumnToIsDisabled['x'] = true;
  }

  setDataExplorerYColumnIsDisabled(yColumnNumber: number): void {
    if (yColumnNumber === 1) {
      this.dataExplorerColumnToIsDisabled['y'] = true;
    } else {
      this.dataExplorerColumnToIsDisabled[`y${yColumnNumber}`] = true;
    }
  }

  /**
   * Setup the table
   */
  setupTable() {
    if (this.tableData == null) {
      /*
       * the student does not have any table data so we will use
       * the table data from the component content
       */
      this.tableData = copy(this.componentContent.tableData);
    }
    this.setTabulatorData();
  }

  /**
   * Reset the table data to its initial state from the component content
   */
  resetTable() {
    if (this.component.hasConnectedComponent()) {
      // this component imports work so we will import the work again
      this.tableData = copy(this.componentContent.tableData);
      this.handleConnectedComponents();
    } else {
      // get the original table from the step content
      this.tableData = copy(this.componentContent.tableData);
      if (this.isDataExplorerEnabled) {
        this.dataExplorerGraphType = null;
        this.dataExplorerXColumn = null;
        this.dataExplorerXAxisLabel = null;
        this.dataExplorerYAxisLabel = null;
        if (this.componentContent.numDataExplorerYAxis > 1) {
          this.dataExplorerYAxisLabels = Array(this.componentContent.numDataExplorerYAxis).fill('');
        } else {
          this.dataExplorerYAxisLabels = null;
        }
        this.createDataExplorerSeries();
        if (this.componentContent.dataExplorerDataToColumn != null) {
          this.setDataExplorerDataToColumn();
        }
      }
      this.setTabulatorData();
      this.studentDataChanged();
    }
  }

  /**
   * Populate the student work into the component
   * @param componentState the component state to populate into the component
   */
  setStudentWork(componentState) {
    if (componentState != null) {
      // get the student data from the component state
      const studentData = componentState.studentData;

      if (studentData != null && studentData.tableData != null) {
        // set the table into the controller
        this.tableData = studentData.tableData;

        const submitCounter = studentData.submitCounter;

        if (submitCounter != null) {
          // populate the submit counter
          this.submitCounter = submitCounter;
        }

        this.selectedRowIndices = studentData.selectedRowIndices
          ? studentData.selectedRowIndices
          : [];

        this.sortOrder = studentData.sortOrder ? studentData.sortOrder : [];

        this.tabulatorSorters = studentData.tabulatorSorters ? studentData.tabulatorSorters : [];

        this.processLatestStudentWork();
      }
    }
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    const componentState: any = this.createNewComponentState();
    const studentData: any = {};
    studentData.tableData = copy(this.tableData);
    studentData.selectedRowIndices = this.componentContent.enableRowSelection
      ? this.selectedRowIndices
      : [];
    studentData.sortOrder = this.sortOrder;
    studentData.tabulatorSorters = this.tabulatorSorters;
    studentData.isDataExplorerEnabled = this.isDataExplorerEnabled;
    studentData.dataExplorerGraphType = this.dataExplorerGraphType;
    studentData.dataExplorerXAxisLabel = this.dataExplorerXAxisLabel;
    studentData.dataExplorerTooltipHeaderColumn = this.dataExplorerTooltipHeaderColumn;
    if (this.dataExplorerYAxisLabel != null) {
      studentData.dataExplorerYAxisLabel = this.dataExplorerYAxisLabel;
    }
    if (this.dataExplorerYAxisLabels) {
      studentData.dataExplorerYAxisLabels = this.dataExplorerYAxisLabels;
    }
    studentData.isDataExplorerScatterPlotRegressionLineEnabled =
      this.isDataExplorerScatterPlotRegressionLineEnabled;
    studentData.dataExplorerSeries = copy(this.dataExplorerSeries);

    studentData.submitCounter = this.submitCounter;
    componentState.isSubmit = this.isSubmit;
    componentState.studentData = studentData;
    componentState.componentType = 'Table';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;

    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }

    this.isSubmit = false;
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }

    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  /**
   * Set the graph data into the table data
   * @param componentState the component state to get the graph data from
   * @param params (optional) the params to specify what columns
   * and rows to overwrite in the table data
   */
  setGraphDataIntoTableData(componentState, params) {
    let trialIndex = 0;
    let seriesIndex = 0;

    if (params != null) {
      if (params.trialIndex != null) {
        trialIndex = params.trialIndex;
      }

      if (params.seriesIndex != null) {
        seriesIndex = params.seriesIndex;
      }

      if (params.showDataAtMouseX) {
        this.showDataAtMouseX(componentState, params);
        return;
      }
    }

    if (componentState != null && componentState.studentData != null) {
      const studentData = componentState.studentData;
      const studentDataVersion = studentData.version;

      if (studentDataVersion == null || studentDataVersion == 1) {
        // this is the old student data format that can't contain trials

        const series = studentData.series;
        if (series != null && series.length > 0) {
          const tempSeries = series[seriesIndex];
          this.setSeriesIntoTable(tempSeries);
        }
      } else {
        // this is the new student data format that can contain trials

        const trials = studentData.trials;
        if (trials != null) {
          const trial = trials[trialIndex];
          if (trial != null) {
            const multipleSeries = trial.series;
            if (multipleSeries != null) {
              const series = multipleSeries[seriesIndex];
              this.setSeriesIntoTable(series);
            }
          }
        }
      }
    }
  }

  /**
   * Show the data at x for all the series.
   * @param componentState The Graph component state.
   * @param params The connected component params.
   */
  showDataAtMouseX(componentState, params) {
    let studentData = componentState.studentData;
    let mouseOverPoints = studentData.mouseOverPoints;
    let x = null;

    // get the x value from the latest mouse over point
    if (mouseOverPoints != null && mouseOverPoints.length > 0) {
      let latestMouseOverPoint = mouseOverPoints[mouseOverPoints.length - 1];
      x = Math.round(latestMouseOverPoint[0]);
    }
    let xUnits = studentData.xAxis.units;
    let yUnits = studentData.yAxis.units;
    let xAxisTitle = studentData.xAxis.title.text;
    let yAxisTitle = studentData.yAxis.title.text;
    this.tableData = [];
    this.tableData.push(this.createTableRow(['Series Name', xAxisTitle, yAxisTitle]));
    for (let trial of studentData.trials) {
      if (trial.show) {
        let multipleSeries = trial.series;
        for (let singleSeries of multipleSeries) {
          if (singleSeries.show !== false) {
            let closestDataPoint = this.getClosestDataPoint(singleSeries.data, x);
            if (closestDataPoint != null) {
              this.tableData.push(
                this.createTableRow([
                  singleSeries.name,
                  Math.round(this.getXFromDataPoint(closestDataPoint)) + ' ' + xUnits,
                  Math.round(this.getYFromDataPoint(closestDataPoint)) + ' ' + yUnits
                ])
              );
            }
          }
        }
      }
    }
  }

  /**
   * Create a cell object.
   * @param text The text to show in the cell.
   * @param editable Whether the student is allowed to edit the contents in the
   * cell.
   * @param size The with of the cell.
   * @return An object.
   */
  createTableCell(text = '', editable = false, size = null) {
    return { text: text, editable: editable, size: size };
  }

  /**
   * Create a row.
   * @param columns An array of strings or objects.
   * @return An array of objects.
   */
  createTableRow(columns: any[]): any[] {
    let row = [];
    for (let column of columns) {
      if (column.constructor.name == 'String') {
        row.push(this.createTableCell(column));
      } else if (column.constructor.name == 'Object') {
        row.push(this.createTableCell(column.text, column.editable, column.size));
      }
    }
    return row;
  }

  /**
   * Get the data point that has the closest x value to the given argument x.
   * @param dataPoints An array of data points. Each data point can be an object or an array.
   * @param x The argument x.
   * @return A data point which can be an object or array.
   */
  private getClosestDataPoint(dataPoints, x): any {
    let closestDataPoint = null;
    let minNumericalXDifference = Infinity;
    for (let dataPoint of dataPoints) {
      let dataPointX = this.getXFromDataPoint(dataPoint);
      let numericalDifference = Math.abs(x - dataPointX);
      if (numericalDifference < minNumericalXDifference) {
        // we have found a new data point that is closer to x
        closestDataPoint = dataPoint;
        minNumericalXDifference = numericalDifference;
      }
    }
    return closestDataPoint;
  }

  /**
   * Get the x value from the data point.
   * @param dataPoint An object or array.
   * @return The x value of the data point.
   */
  getXFromDataPoint(dataPoint: any): number {
    if (dataPoint.constructor.name == 'Object') {
      return dataPoint.x;
    } else if (dataPoint.constructor.name == 'Array') {
      return dataPoint[0];
    }
  }

  /**
   * Get the y value from the data point.
   * @param dataPoint An object or array.
   * @return The y value of the data point.
   */
  getYFromDataPoint(dataPoint: any): number {
    if (dataPoint.constructor.name == 'Object') {
      return dataPoint.y;
    } else if (dataPoint.constructor.name == 'Array') {
      return dataPoint[1];
    }
  }

  /**
   * Set the series data into the table
   * @param series an object that contains the data for a single series
   * @param params the parameters for where to place the points in the table
   */
  setSeriesIntoTable(series, params = null) {
    /*
     * the default is set to not skip the first row and for the
     * x column to be the first column and the y column to be the
     * second column
     */
    let skipFirstRow = true;
    let xColumn = 0;
    let yColumn = 1;

    if (params != null) {
      if (params.skipFirstRow != null) {
        // determine whether to skip the first row
        skipFirstRow = params.skipFirstRow;
      }

      if (params.xColumn != null) {
        // get the x column
        xColumn = params.xColumn;
      }

      if (params.yColumn != null) {
        // get the y column
        yColumn = params.yColumn;
      }
    }

    if (series != null) {
      const tableDataRows = this.tableData;

      // get the data from the series
      const data = series.data;

      if (data != null) {
        // our counter for traversing the data rows
        let dataRowCounter = 0;

        // loop through all the table data rows
        for (let r = 0; r < tableDataRows.length; r++) {
          if (skipFirstRow && r === 0) {
            // skip the first table data row
            continue;
          }

          let x = '';
          let y = '';

          // get the data row
          const dataRow = data[dataRowCounter];

          if (dataRow != null) {
            // get the x and y values from the data row
            x = dataRow[0];
            y = dataRow[1];
          }

          // set the x and y values into the table data
          this.setTableDataCellValue(xColumn, r, null, x);
          this.setTableDataCellValue(yColumn, r, null, y);

          // increment the data row counter
          dataRowCounter++;
        }
      }
    }
  }

  /**
   * Set the table data cell value
   * @param x the x index (0 indexed)
   * @param y the y index (0 indexed)
   * @param value the value to set in the cell
   */
  setTableDataCellValue(x, y, table, value): void {
    let tableDataRows = table;
    if (table == null) {
      tableDataRows = this.tableData;
    }
    if (tableDataRows != null) {
      const row = tableDataRows[y];
      if (row != null) {
        const cell = row[x];
        if (cell != null) {
          cell.text = value;
        }
      }
    }
  }

  /**
   * Get the value of a cell in the table
   * @param x the x coordinate
   * @param y the y coordinate
   * @param table (optional) table data to get the value from. this is used
   * when we want to look up the value in the default authored table
   * @returns the cell value (text or a number)
   */
  getTableDataCellValue(x, y, table = null): string | number {
    let cellValue = null;
    if (table == null) {
      table = this.tableData;
    }
    if (table != null) {
      const row = table[y];
      if (row != null) {
        const cell = row[x];
        if (cell != null) {
          cellValue = cell.text;
        }
      }
    }
    return cellValue;
  }

  protected snipTable(): void {
    const tableElement = this.getElementById(
      this.tableService.getTableId(this.nodeId, this.componentId),
      true
    );
    html2canvas(tableElement).then((canvas: any) => {
      const pngFile = convertToPNGFile(canvas);
      this.notebookService.addNote(this.studentDataService.getCurrentNodeId(), pngFile);
    });
  }

  handleConnectedComponents() {
    let isStudentDataChanged = false;
    for (const connectedComponentAndComponentState of this.getConnectedComponentsAndTheirComponentStates()) {
      const connectedComponent = connectedComponentAndComponentState.connectedComponent;
      const componentState = connectedComponentAndComponentState.componentState;
      if (componentState != null) {
        switch (componentState.componentType) {
          case 'Table':
            this.importTableComponentState(componentState, connectedComponent);
            isStudentDataChanged = true;
            break;
          case 'Graph':
            this.tableData = copy(this.componentContent.tableData);
            this.setGraphDataIntoTableData(componentState, connectedComponent);
            isStudentDataChanged = true;
            break;
          case 'Embedded':
            this.setStudentWork(componentState);
            isStudentDataChanged = true;
            break;
        }
      }
    }
    if (isStudentDataChanged) {
      this.setTabulatorData();
      this.studentDataChanged();
    }
  }

  private importTableComponentState(componentState: any, connectedComponent: any): void {
    if (connectedComponent.type === 'showWork') {
      this.tableData = componentState.studentData.tableData;
      this.isDisabled = true;
    } else {
      if (connectedComponent.action === 'append') {
        this.appendComponentState(componentState, connectedComponent);
      } else {
        this.mergeComponentState(componentState);
      }
    }
  }

  getConnectedComponentsAndTheirComponentStates(): any[] {
    const connectedComponentsAndTheirComponentStates = [];
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const componentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        connectedComponent.nodeId,
        connectedComponent.componentId
      );
      const connectedComponentsAndComponentState = {
        connectedComponent: connectedComponent,
        componentState: copy(componentState)
      };
      connectedComponentsAndTheirComponentStates.push(connectedComponentsAndComponentState);
    }
    return connectedComponentsAndTheirComponentStates;
  }

  private mergeComponentState(componentState: any): void {
    if (this.tableData == null) {
      this.tableData = copy(this.componentContent.tableData);
    }
    if (this.componentContent.numRows === 0 || this.componentContent.numColumns === 0) {
      this.tableData = componentState.studentData.tableData;
    } else {
      this.mergeTableData(componentState.studentData.tableData);
    }
  }

  mergeTableData(tableData: any): void {
    for (let y = 0; y < this.componentContent.numRows; y++) {
      for (let x = 0; x < this.componentContent.numColumns; x++) {
        const cellValue = this.getTableDataCellValue(x, y, tableData);
        if (cellValue != null && cellValue !== '') {
          this.setTableDataCellValue(x, y, this.tableData, cellValue);
        }
      }
    }
  }

  private appendComponentState(componentState, connectedComponent): void {
    if (this.tableData == null) {
      this.tableData = copy(this.componentContent.tableData);
    }
    let tableData = componentState.studentData.tableData;
    if (connectedComponent.excludeFirstRow) {
      tableData = tableData.slice(1);
    }
    this.tableData = this.tableData.concat(tableData);
  }

  studentDataChanged() {
    if (this.isDataExplorerEnabled) {
      this.updateColumnNames();
      this.updateColumnsUsed();
      this.updateDataExplorerSeriesNames();
    }
    this.setIsDirtyAndBroadcast();
    this.setIsSubmitDirtyAndBroadcast();
    this.clearLatestComponentState();
    const action = 'change';
    this.createComponentStateAndBroadcast(action);
  }

  updateColumnNames(): void {
    const firstRow = this.tableData[0];
    this.columnNames = firstRow.map((cell: any): string => cell.text);
  }

  private updateColumnsUsed(): void {
    const firstRow = this.tableData[0];
    for (let c = 0; c < firstRow.length; c++) {
      this.columnIndexToIsUsed.set(c, this.isColumnUsed(c));
    }
  }

  private isColumnUsed(columnIndex: number): boolean {
    return (
      columnIndex === this.dataExplorerXColumn ||
      this.dataExplorerSeries.some((series) => {
        return series.yColumn === columnIndex;
      })
    );
  }

  updateDataExplorerSeriesNames(): void {
    for (const singleSeries of this.dataExplorerSeries) {
      if (singleSeries.yColumn != null) {
        singleSeries.name = this.columnNames[singleSeries.yColumn];
      }
    }
  }

  dataExplorerXColumnChanged(): void {
    for (const singleSeries of this.dataExplorerSeries) {
      singleSeries.xColumn = this.dataExplorerXColumn;
    }
    this.updateDataExplorerXAxisLabel(this.dataExplorerXColumn);
    this.studentDataChanged();
  }

  dataExplorerYColumnChanged(index: number): void {
    const yColumn = this.dataExplorerSeries[index].yColumn;
    this.dataExplorerSeries[index].name = this.columnNames[yColumn];
    if (!this.isDataExplorerOneYAxis()) {
      this.setDataExplorerSeriesYAxis(index);
    }
    this.updateDataExplorerYAxisLabel(index, yColumn);
    this.studentDataChanged();
  }

  private isDataExplorerOneYAxis(): boolean {
    return (
      this.componentContent.numDataExplorerYAxis == null ||
      this.componentContent.numDataExplorerYAxis === 1
    );
  }

  setDataExplorerSeriesYAxis(index) {
    if (
      this.dataExplorerSeriesParams != null &&
      this.dataExplorerSeriesParams[index] != null &&
      this.dataExplorerSeriesParams[index].yAxis != null
    ) {
      this.dataExplorerSeries[index].yAxis = this.dataExplorerSeriesParams[index].yAxis;
    }
  }

  createDataExplorerSeries() {
    this.dataExplorerSeries = [];
    for (let index = 0; index < this.numDataExplorerSeries; index++) {
      const dataExplorerSeries = {
        xColumn: null,
        yColumn: null,
        yAxis: this.getYAxisForDataExplorerSeries(index)
      };
      this.dataExplorerSeries.push(dataExplorerSeries);
    }
  }

  getYAxisForDataExplorerSeries(index) {
    if (this.dataExplorerSeriesParams != null) {
      return this.dataExplorerSeriesParams[index].yAxis;
    }
    return null;
  }

  repopulateDataExplorerData(componentState) {
    this.dataExplorerGraphType = componentState.studentData.dataExplorerGraphType;
    this.dataExplorerXAxisLabel = componentState.studentData.dataExplorerXAxisLabel;
    this.dataExplorerYAxisLabel = componentState.studentData.dataExplorerYAxisLabel;
    this.dataExplorerYAxisLabels = componentState.studentData.dataExplorerYAxisLabels;
    if (componentState.studentData.dataExplorerSeries != null) {
      this.dataExplorerSeries = copy(componentState.studentData.dataExplorerSeries);
      this.dataExplorerXColumn = this.dataExplorerSeries[0].xColumn;
    }
  }

  processConnectedComponentState(componentState: any): void {
    const connectedComponent = this.component.getConnectedComponent(
      componentState.nodeId,
      componentState.componentId
    );
    const componentType = this.projectService.getComponentType(
      connectedComponent.nodeId,
      connectedComponent.componentId
    );
    const componentStateCopy = copy(componentState);
    if (componentType === 'Table') {
      this.setStudentWork(componentStateCopy);
      this.isDirty = true;
    } else if (componentType === 'Graph') {
      this.setGraphDataIntoTableData(componentStateCopy, connectedComponent);
      this.isDirty = true;
    } else if (componentType === 'Embedded') {
      this.setStudentWork(componentStateCopy);
      this.isDirty = true;
      this.studentDataService.broadcastComponentSaveTriggered({
        nodeId: this.nodeId,
        componentId: this.componentId
      });
    }
    this.setTabulatorData();
    if (componentType === 'Embedded') {
      this.changeDetectorRef.detectChanges();
    }
  }

  attachStudentAsset(studentAsset: any): void {
    // TODO: make sure the asset is a csv file then populate the csv data into the table
  }

  private setTabulatorData(): void {
    this.tabulatorData = this.tabulatorDataService.convertTableDataToTabulator(
      this.tableData,
      this.componentContent.globalCellSize
    );
  }

  tabulatorCellChanged(cell: Tabulator.CellComponent): void {
    const columnIndex = parseInt(cell.getColumn().getField());
    const rowIndex = cell.getRow().getIndex() + 1;
    this.tableData[rowIndex][columnIndex].text = cell.getValue();
    this.studentDataChanged();
  }

  tabulatorRowSelectionChanged(rows: Tabulator.RowComponent[]): void {
    this.selectedRowIndices = [];
    for (const row of rows) {
      this.selectedRowIndices.push(row.getIndex());
    }
    this.studentDataChanged();
  }

  tabulatorRowSortChanged(sortData: any): void {
    this.sortOrder = sortData.sortOrder;
    this.tabulatorSorters = sortData.tabSorters;
    this.studentDataChanged();
  }
}
