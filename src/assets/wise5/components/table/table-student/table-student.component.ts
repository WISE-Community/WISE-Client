import * as html2canvas from 'html2canvas';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { Tabulator } from 'tabulator-tables';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { TableService } from '../tableService';
import { MatDialog } from '@angular/material/dialog';
import { TabulatorData } from '../TabulatorData';
import { TabulatorDataService } from '../tabulatorDataService';

@Component({
  selector: 'table-student',
  templateUrl: 'table-student.component.html',
  styleUrls: ['table-student.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableStudent extends ComponentStudent {
  columnIndexToIsUsed: Map<number, boolean> = new Map();
  columnNames: string[];
  dataExplorerColumnToIsDisabled: any = {};
  dataExplorerGraphTypes: any[];
  dataExplorerGraphType: string;
  dataExplorerSeries: any[];
  dataExplorerSeriesParams: any[];
  dataExplorerXAxisLabel: string;
  dataExplorerXColumn: number;
  dataExplorerYAxisLabel: string;
  dataExplorerYAxisLabels: string[];
  isDataExplorerEnabled: boolean;
  isDataExplorerScatterPlotRegressionLineEnabled: boolean;
  isResetTableButtonVisible: boolean;
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
    protected AnnotationService: AnnotationService,
    private changeDetectorRef: ChangeDetectorRef,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    private TableService: TableService,
    private TabulatorDataService: TabulatorDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    // holds the the table data
    this.tableData = null;

    // whether the reset table button is shown or not
    this.isResetTableButtonVisible = true;

    // the label for the notebook in thos project
    this.notebookConfig = this.NotebookService.getNotebookConfig();

    this.latestConnectedComponentState = null;
    this.latestConnectedComponentParams = null;

    this.tableId = this.TableService.getTableId(this.nodeId, this.componentId);

    this.isDataExplorerEnabled = this.componentContent.isDataExplorerEnabled;
    if (this.isDataExplorerEnabled) {
      this.initializeDataExplorer();
    }

    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.isResetTableButtonVisible = true;

    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      // we will show work from another component
      this.handleConnectedComponents();
    } else if (
      this.TableService.componentStateHasStudentWork(this.componentState, this.componentContent)
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

    // set up the table
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
    this.isDataExplorerScatterPlotRegressionLineEnabled = this.componentContent.isDataExplorerScatterPlotRegressionLineEnabled;
    this.dataExplorerYAxisLabels = Array(this.componentContent.numDataExplorerYAxis).fill('');
    this.dataExplorerSeriesParams = this.componentContent.dataExplorerSeriesParams;
  }

  setDataExplorerDataToColumn(): void {
    for (let index = 0; index < this.dataExplorerSeries.length; index++) {
      const xColumn = this.getDataExplorerXDataColumn();
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
    this.dataExplorerXAxisLabel = this.getColumnName(columnIndex);
  }

  setYDataToColumn(dataExplorerSeriesIndex: number, columnIndex: number): void {
    this.dataExplorerSeries[dataExplorerSeriesIndex].yColumn = columnIndex;
    this.dataExplorerSeries[dataExplorerSeriesIndex].name = this.getColumnName(columnIndex);
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
      yAxisLabel = this.dataExplorerYAxisLabels[
        this.dataExplorerSeriesParams[dataExplorerSeriesIndex].yAxis
      ];
    }
    return yAxisLabel == null || yAxisLabel === '';
  }

  updateDataExplorerYAxisLabel(dataExplorerSeriesIndex: number, columnIndex: number): void {
    const columnName = this.getColumnName(columnIndex);
    if (this.isDataExplorerOneYAxis()) {
      this.dataExplorerYAxisLabel = columnName;
    } else {
      const yAxisIndex = this.dataExplorerSeries[dataExplorerSeriesIndex].yAxis;
      this.setDataExplorerYAxisLabelWithMultipleYAxes(yAxisIndex, columnName);
    }
  }

  isAllDataExplorerSeriesSpecified(): boolean {
    for (const singleSeries of this.dataExplorerSeries) {
      if (singleSeries.xColumn == null || singleSeries.yColumn == null) {
        return false;
      }
    }
    return true;
  }

  getDataExplorerXDataColumn(): number {
    return this.getDataExplorerDataToColumn('x');
  }

  /**
   * @param ySeriesNumber (1 indexed)
   * @return The column index (0 indexed)
   */
  getDataExplorerYDataColumn(ySeriesNumber: number): number {
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

  handleStudentWorkSavedToServer(componentState: any): void {
    if (this.isForThisComponent(componentState)) {
      this.isDirty = false;
      this.emitComponentDirty(false);
      this.latestComponentState = componentState;
    }
  }

  /**
   * Get a copy of the table data
   * @param tableData the table data to copy
   * @return a copy of the table data
   */
  getCopyOfTableData(tableData) {
    let tableDataCopy = null;

    if (tableData != null) {
      // create a JSON string from the table data
      const tableDataJSONString = JSON.stringify(tableData);

      // create a JSON object from the table data string
      const tableDataJSON = JSON.parse(tableDataJSONString);

      tableDataCopy = tableDataJSON;
    }

    return tableDataCopy;
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
      this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
    }
    this.setTabulatorData();
  }

  /**
   * Reset the table data to its initial state from the component content
   */
  resetTable() {
    if (this.component.hasConnectedComponent()) {
      // this component imports work so we will import the work again
      this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
      this.handleConnectedComponents();
    } else {
      // get the original table from the step content
      this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
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
   * Get the rows of the table data
   */
  getTableDataRows() {
    return this.tableData;
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
    studentData.tableData = this.getCopyOfTableData(this.tableData);
    studentData.selectedRowIndices = this.getSelectedRowIndices();
    studentData.sortOrder = this.sortOrder;
    studentData.tabulatorSorters = this.tabulatorSorters;
    studentData.isDataExplorerEnabled = this.isDataExplorerEnabled;
    studentData.dataExplorerGraphType = this.dataExplorerGraphType;
    studentData.dataExplorerXAxisLabel = this.dataExplorerXAxisLabel;
    if (this.dataExplorerYAxisLabel != null) {
      studentData.dataExplorerYAxisLabel = this.dataExplorerYAxisLabel;
    }
    if (this.dataExplorerYAxisLabels) {
      studentData.dataExplorerYAxisLabels = this.dataExplorerYAxisLabels;
    }
    studentData.isDataExplorerScatterPlotRegressionLineEnabled = this.isDataExplorerScatterPlotRegressionLineEnabled;
    studentData.dataExplorerSeries = this.UtilService.makeCopyOfJSONObject(this.dataExplorerSeries);

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
   * Check whether we need to show the reset table button
   * @return whether to show the reset table button
   */
  showResetTableButton() {
    return this.isResetTableButtonVisible;
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
        // get the trial index
        trialIndex = params.trialIndex;
      }

      if (params.seriesIndex != null) {
        // get the series index
        seriesIndex = params.seriesIndex;
      }

      if (params.showDataAtMouseX) {
        this.showDataAtMouseX(componentState, params);
        return;
      }
    }

    if (componentState != null && componentState.studentData != null) {
      // get the student data
      const studentData = componentState.studentData;

      // get the student data version
      const studentDataVersion = studentData.version;

      if (studentDataVersion == null || studentDataVersion == 1) {
        // this is the old student data format that can't contain trials

        // get the series
        const series = studentData.series;

        if (series != null && series.length > 0) {
          // get the series that we will get data from
          const tempSeries = series[seriesIndex];

          // set the series data into the table
          this.setSeriesIntoTable(tempSeries);
        }
      } else {
        // this is the new student data format that can contain trials

        // get all the trials
        const trials = studentData.trials;

        if (trials != null) {
          // get the specific trial we want
          const trial = trials[trialIndex];

          if (trial != null) {
            // get the series in the trial
            const multipleSeries = trial.series;

            if (multipleSeries != null) {
              // get the specific series we want
              const series = multipleSeries[seriesIndex];

              // set the series data into the table
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
    this.removeAllCellsFromTableData();
    this.addTableDataRow(this.createTableRow(['Series Name', xAxisTitle, yAxisTitle]));
    for (let trial of studentData.trials) {
      if (trial.show) {
        let multipleSeries = trial.series;
        for (let singleSeries of multipleSeries) {
          if (singleSeries.show !== false) {
            let closestDataPoint = this.getClosestDataPoint(singleSeries.data, x);
            if (closestDataPoint != null) {
              this.addTableDataRow(
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
   * Remove all the rows and cells from the table data.
   */
  removeAllCellsFromTableData() {
    this.tableData = [];
  }

  /**
   * Append a row to the table data.
   * @param row An array of objects. Each object represents a cell in the table.
   */
  addTableDataRow(row) {
    this.tableData.push(row);
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
  createTableRow(columns) {
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
  getClosestDataPoint(dataPoints, x) {
    let closestDataPoint = null;
    let minNumericalXDifference = Infinity;
    for (let dataPoint of dataPoints) {
      let dataPointX = this.getXFromDataPoint(dataPoint);
      let numericalDifference = this.getNumericalAbsoluteDifference(x, dataPointX);
      if (numericalDifference < minNumericalXDifference) {
        // we have found a new data point that is closer to x
        closestDataPoint = dataPoint;
        minNumericalXDifference = numericalDifference;
      }
    }
    return closestDataPoint;
  }

  /**
   * Get the absolute value of the difference between the two numbers.
   * @param x1 A number.
   * @param x2 A number.
   * @return The absolute value of the difference between the two numbers.
   */
  getNumericalAbsoluteDifference(x1, x2) {
    return Math.abs(x1 - x2);
  }

  /**
   * Get the x value from the data point.
   * @param dataPoint An object or array.
   * @return The x value of the data point.
   */
  getXFromDataPoint(dataPoint) {
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
  getYFromDataPoint(dataPoint) {
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
      // get the table data rows
      const tableDataRows = this.getTableDataRows();

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
  setTableDataCellValue(x, y, table, value) {
    let tableDataRows = table;

    if (table == null) {
      // get the table data rows
      tableDataRows = this.getTableDataRows();
    }

    if (tableDataRows != null) {
      // get the row we want
      const row = tableDataRows[y];

      if (row != null) {
        // get the cell we want
        const cell = row[x];

        if (cell != null) {
          // set the value into the cell
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
  getTableDataCellValue(x, y, table = null) {
    let cellValue = null;

    if (table == null) {
      // get the table data rows
      table = this.getTableDataRows();
    }

    if (table != null) {
      // get the row we want
      const row = table[y];

      if (row != null) {
        // get the cell we want
        const cell = row[x];

        if (cell != null) {
          // set the value into the cell
          cellValue = cell.text;
        }
      }
    }

    return cellValue;
  }

  /**
   * Get the number of rows in the table
   * @returns the number of rows in the table
   */
  getNumRows() {
    return this.componentContent.numRows;
  }

  /**
   * Get the number of columns in the table
   * @returns the number of columns in the table
   */
  getNumColumns() {
    return this.componentContent.numColumns;
  }

  /**
   * Check if the table is empty. The table is empty if all the cells are empty string.
   * @returns whether the table is empty
   */
  isTableEmpty() {
    let result = true;

    const numRows = this.getNumRows();
    const numColumns = this.getNumColumns();

    // loop through all the rows
    for (let r = 0; r < numRows; r++) {
      // loop through all the cells in the row
      for (let c = 0; c < numColumns; c++) {
        // get a cell value
        const cellValue = this.getTableDataCellValue(c, r);

        if (cellValue != null && cellValue != '') {
          // the cell is not empty so the table is not empty
          result = false;
          break;
        }
      }

      if (result == false) {
        break;
      }
    }

    return result;
  }

  /**
   * Check if the table is set to the default values. The table
   * is set to the default values if all the cells match the
   * values in the default authored table.
   * @returns whether the table is set to the default values
   */
  isTableReset() {
    let result = true;

    const numRows = this.getNumRows();
    const numColumns = this.getNumColumns();

    // get the default table
    const defaultTable = this.componentContent.tableData;

    // loop through all the rows
    for (let r = 0; r < numRows; r++) {
      // loop through all the cells in the row
      for (let c = 0; c < numColumns; c++) {
        // get the cell value from the student table
        const cellValue = this.getTableDataCellValue(c, r);

        // get the cell value from the default table
        const defaultCellValue = this.getTableDataCellValue(c, r, defaultTable);

        if (cellValue != defaultCellValue) {
          // the cell values do not match so the table is not set to the default values
          result = false;
          break;
        }
      }

      if (result == false) {
        break;
      }
    }

    return result;
  }

  /**
   * Snip the table by converting it to an image
   */
  snipTable() {
    const tableElement = this.getElementById(
      this.TableService.getTableId(this.nodeId, this.componentId),
      true
    );
    html2canvas(tableElement).then((canvas: any) => {
      const base64Image = canvas.toDataURL('image/png');
      const imageObject = this.UtilService.getImageObjectFromBase64String(base64Image);
      this.NotebookService.addNote(this.StudentDataService.getCurrentNodeId(), imageObject);
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
            this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
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

  importTableComponentState(componentState: any, connectedComponent: any): void {
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

  getConnectedComponentsAndTheirComponentStates() {
    const connectedComponentsAndTheirComponentStates = [];
    for (const connectedComponent of this.componentContent.connectedComponents) {
      const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        connectedComponent.nodeId,
        connectedComponent.componentId
      );
      const connectedComponentsAndComponentState = {
        connectedComponent: connectedComponent,
        componentState: this.UtilService.makeCopyOfJSONObject(componentState)
      };
      connectedComponentsAndTheirComponentStates.push(connectedComponentsAndComponentState);
    }
    return connectedComponentsAndTheirComponentStates;
  }

  mergeComponentState(componentState) {
    if (this.tableData == null) {
      this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
    }
    if (this.componentContent.numRows === 0 || this.componentContent.numColumns === 0) {
      this.tableData = componentState.studentData.tableData;
    } else {
      this.mergeTableData(componentState.studentData.tableData);
    }
  }

  mergeTableData(tableData) {
    for (let y = 0; y < this.getNumRows(); y++) {
      for (let x = 0; x < this.getNumColumns(); x++) {
        const cellValue = this.getTableDataCellValue(x, y, tableData);
        if (cellValue != null && cellValue !== '') {
          this.setTableDataCellValue(x, y, this.tableData, cellValue);
        }
      }
    }
  }

  appendComponentState(componentState, connectedComponent) {
    if (this.tableData == null) {
      this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
    }
    let tableData = componentState.studentData.tableData;
    if (connectedComponent.excludeFirstRow) {
      tableData = tableData.slice(1);
    }
    this.appendTable(tableData);
  }

  appendTable(tableData) {
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

  updateColumnNames() {
    const firstRow = this.tableData[0];
    this.columnNames = firstRow.map((cell: any): string => {
      return cell.text;
    });
  }

  updateColumnsUsed(): void {
    const firstRow = this.tableData[0];
    for (let c = 0; c < firstRow.length; c++) {
      this.columnIndexToIsUsed.set(c, this.isColumnUsed(c));
    }
  }

  isColumnUsed(columnIndex: number): boolean {
    return (
      columnIndex === this.dataExplorerXColumn ||
      this.dataExplorerSeries.some((series) => {
        return series.yColumn === columnIndex;
      })
    );
  }

  updateDataExplorerSeriesNames() {
    for (const singleSeries of this.dataExplorerSeries) {
      if (singleSeries.yColumn != null) {
        singleSeries.name = this.columnNames[singleSeries.yColumn];
      }
    }
  }

  /**
   * @param columnIndex (0 indexed)
   */
  getColumnName(columnIndex: number): string {
    return this.columnNames[columnIndex];
  }

  dataExplorerXColumnChanged() {
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

  isDataExplorerOneYAxis() {
    return (
      this.componentContent.numDataExplorerYAxis == null ||
      this.componentContent.numDataExplorerYAxis === 1
    );
  }

  getDataExplorerYAxisLabelWhenOneYAxis() {
    let yAxisLabel = '';
    for (let index = 0; index < this.dataExplorerSeries.length; index++) {
      const yColumn = this.dataExplorerSeries[index].yColumn;
      if (yColumn != null) {
        const columnName = this.getColumnName(yColumn);
        if (yAxisLabel != '') {
          yAxisLabel += ' <br/> ';
        }
        yAxisLabel += columnName;
      }
    }
    return yAxisLabel;
  }

  /**
   * @param yAxisIndex (0 indexed)
   * @param label The axis label.
   */
  setDataExplorerYAxisLabelWithMultipleYAxes(yAxisIndex: number, label: string): void {
    this.dataExplorerYAxisLabels[yAxisIndex] = label;
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
      this.dataExplorerSeries = this.UtilService.makeCopyOfJSONObject(
        componentState.studentData.dataExplorerSeries
      );
      this.dataExplorerXColumn = this.dataExplorerSeries[0].xColumn;
    }
  }

  processConnectedComponentState(componentState: any): void {
    const connectedComponent = this.UtilService.getConnectedComponentByComponentState(
      this.componentContent,
      componentState
    );
    const componentType = this.ProjectService.getComponentType(
      connectedComponent.nodeId,
      connectedComponent.componentId
    );
    const componentStateCopy = this.UtilService.makeCopyOfJSONObject(componentState);
    if (componentType === 'Table') {
      this.setStudentWork(componentStateCopy);
      this.isDirty = true;
    } else if (componentType === 'Graph') {
      this.setGraphDataIntoTableData(componentStateCopy, connectedComponent);
      this.isDirty = true;
    } else if (componentType === 'Embedded') {
      this.setStudentWork(componentStateCopy);
      this.isDirty = true;
      this.StudentDataService.broadcastComponentSaveTriggered({
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
    this.tabulatorData = this.TabulatorDataService.convertTableDataToTabulator(
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

  tabulatorRendered(): void {
    this.broadcastDoneRenderingComponent();
  }

  tabulatorRowSelectionChanged(rows: Tabulator.RowComponent[]): void {
    this.selectedRowIndices = [];
    for (const row of rows) {
      this.selectedRowIndices.push(row.getIndex());
    }
    this.studentDataChanged();
  }

  private getSelectedRowIndices(): number[] {
    return this.componentContent.enableRowSelection ? this.selectedRowIndices : [];
  }

  tabulatorRowSortChanged(sortData: any): void {
    this.sortOrder = sortData.sortOrder;
    this.tabulatorSorters = sortData.tabSorters;
    this.studentDataChanged();
  }
}
