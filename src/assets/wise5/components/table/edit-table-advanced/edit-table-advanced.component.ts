import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'edit-table-advanced',
  templateUrl: 'edit-table-advanced.component.html',
  styleUrls: ['edit-table-advanced.component.scss']
})
export class EditTableAdvancedComponent extends EditAdvancedComponentComponent {
  MAX_ALLOWED_CELLS_IN_IMPORT = 2000;

  allowedConnectedComponentTypes = ['Embedded', 'Graph', 'Table'];
  columnNames: string[] = [];
  isDataExplorerScatterPlotEnabled: boolean;
  isDataExplorerLineGraphEnabled: boolean;
  isDataExplorerBarGraphEnabled: boolean;
  isImportingTable: boolean = false;
  numColumns: number;
  importTableMessage: string;

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected TeacherProjectService: TeacherProjectService,
    private UtilService: UtilService
  ) {
    super(NodeService, NotebookService, TeacherProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.authoringComponentContent.isDataExplorerEnabled) {
      this.repopulateDataExplorerGraphTypes();
      this.initializeDataExplorerSeriesParams();
      this.tryInitializeDataExplorerDataToColumn();
    }
    this.numColumns = this.getNumTableColumns(this.authoringComponentContent);
    this.columnNames = this.getColumnNames(this.authoringComponentContent);
  }

  initializeDataExplorerSeriesParams(): void {
    if (this.authoringComponentContent.dataExplorerSeriesParams == null) {
      this.authoringComponentContent.dataExplorerSeriesParams = [];
      for (let s = 0; s < this.authoringComponentContent.numDataExplorerSeries; s++) {
        this.authoringComponentContent.dataExplorerSeriesParams.push({});
      }
    }
  }

  initializeDataExplorerGraphTypes(): void {
    this.authoringComponentContent.dataExplorerGraphTypes = [];
    this.authoringComponentContent.dataExplorerGraphTypes.push(
      this.createGraphTypeObject('Scatter Plot', 'scatter')
    );
  }

  repopulateDataExplorerGraphTypes(): void {
    this.isDataExplorerScatterPlotEnabled = false;
    this.isDataExplorerLineGraphEnabled = false;
    this.isDataExplorerBarGraphEnabled = false;
    for (const graphType of this.authoringComponentContent.dataExplorerGraphTypes) {
      if (graphType.value === 'scatter') {
        this.isDataExplorerScatterPlotEnabled = true;
      } else if (graphType.value === 'line') {
        this.isDataExplorerLineGraphEnabled = true;
      } else if (graphType.value === 'column') {
        this.isDataExplorerBarGraphEnabled = true;
      }
    }
  }

  tryInitializeDataExplorerDataToColumn(): void {
    if (this.authoringComponentContent.dataExplorerDataToColumn == null) {
      this.authoringComponentContent.dataExplorerDataToColumn = {};
    }
  }

  getNumTableColumns(componentContent: any): number {
    return this.getTableDataFirstRow(componentContent).length;
  }

  getColumnNames(componentContent: any): string[] {
    return this.getTableDataFirstRow(componentContent).map((cell: any): string => {
      return cell.text;
    });
  }

  getTableDataFirstRow(componentContent: any): any[] {
    return componentContent.tableData[0];
  }

  toggleDataExplorer(): void {
    if (this.authoringComponentContent.isDataExplorerEnabled) {
      if (this.authoringComponentContent.dataExplorerGraphTypes == null) {
        this.initializeDataExplorerGraphTypes();
        this.repopulateDataExplorerGraphTypes();
      }
      if (this.authoringComponentContent.numDataExplorerSeries == null) {
        this.authoringComponentContent.numDataExplorerSeries = 1;
      }
      if (this.authoringComponentContent.numDataExplorerYAxis == null) {
        this.authoringComponentContent.numDataExplorerYAxis = 1;
      }
      if (this.authoringComponentContent.isDataExplorerAxisLabelsEditable == null) {
        this.authoringComponentContent.isDataExplorerAxisLabelsEditable = false;
      }
      if (this.authoringComponentContent.dataExplorerSeriesParams == null) {
        this.authoringComponentContent.dataExplorerSeriesParams = [{}];
      }
      if (this.authoringComponentContent.dataExplorerDataToColumn == null) {
        this.authoringComponentContent.dataExplorerDataToColumn = {};
      }
    }
    this.componentChanged();
  }

  dataExplorerToggleScatterPlot(): void {
    this.dataExplorerToggleGraphType('Scatter Plot', 'scatter');
  }

  dataExplorerToggleLineGraph(): void {
    this.dataExplorerToggleGraphType('Line Graph', 'line');
  }

  dataExplorerToggleBarGraph(): void {
    this.dataExplorerToggleGraphType('Bar Graph', 'column');
  }

  dataExplorerToggleGraphType(name: string, value: string): void {
    const graphTypes = this.authoringComponentContent.dataExplorerGraphTypes;
    for (let index = 0; index < graphTypes.length; index++) {
      if (graphTypes[index].value === value) {
        graphTypes.splice(index, 1);
        this.componentChanged();
        return;
      }
    }
    graphTypes.push(this.createGraphTypeObject(name, value));
    this.componentChanged();
  }

  createGraphTypeObject(name: string, value: string): any {
    return { name: name, value: value };
  }

  numDataExplorerSeriesChanged(): void {
    const count = this.authoringComponentContent.numDataExplorerSeries;
    if (this.authoringComponentContent.dataExplorerSeriesParams.length < count) {
      this.increaseNumDataExplorerSeries(count);
    } else if (this.authoringComponentContent.dataExplorerSeriesParams.length > count) {
      this.decreaseNumDataExplorerSeries(count);
    }
    this.componentChanged();
  }

  increaseNumDataExplorerSeries(count: number): void {
    const numToAdd = count - this.authoringComponentContent.dataExplorerSeriesParams.length;
    for (let s = 0; s < numToAdd; s++) {
      this.authoringComponentContent.dataExplorerSeriesParams.push({});
    }
  }

  decreaseNumDataExplorerSeries(count: number): void {
    this.authoringComponentContent.dataExplorerSeriesParams = this.authoringComponentContent.dataExplorerSeriesParams.slice(
      0,
      count
    );
  }

  numDataExplorerYAxisChanged(): void {
    this.updateDataExplorerSeriesParamsYAxis();
    this.componentChanged();
  }

  updateDataExplorerSeriesParamsYAxis(): void {
    for (const params of this.authoringComponentContent.dataExplorerSeriesParams) {
      if (params.yAxis >= this.authoringComponentContent.numDataExplorerYAxis) {
        params.yAxis = 0;
      }
    }
  }

  importTableFile(event: any): void {
    if (confirm($localize`Are you sure you want to overwrite the existing table?`)) {
      this.showImportingTableDisplay();
      this.setImportTableMessage($localize`Importing table...`);
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        const tableContent = this.UtilService.CSVToArray(fileContent);
        const numCells = this.getNumCells(tableContent);
        if (numCells > this.MAX_ALLOWED_CELLS_IN_IMPORT) {
          this.setImportTableMessage(
            $localize`Error: The table contains more than ${this.MAX_ALLOWED_CELLS_IN_IMPORT} cells`
          );
        } else {
          this.importTable(tableContent);
          this.setImportTableMessage($localize`Successfully imported table`);
        }
        this.hideImportingTableDisplay();
      };
      reader.readAsText(event.target.files[0]);
    }
    event.target.value = null;
  }

  getNumCells(tableContent: string[][]): number {
    let numCells = 0;
    for (const row of tableContent) {
      numCells += row.length;
    }
    return numCells;
  }

  importTable(tableContent: string[][]): void {
    const tableData = this.convertToTableData(tableContent);
    this.authoringComponentContent.tableData = tableData;
    this.authoringComponentContent.numRows = this.getNumRows(tableData);
    this.authoringComponentContent.numColumns = this.getNumColumns(tableData);
    this.componentChanged();
  }

  convertToTableData(stringArray: string[][]): any[][] {
    const table = [];
    for (const row of stringArray) {
      const tableRow = [];
      for (const cell of row) {
        tableRow.push({ text: cell, editable: true, size: null });
      }
      table.push(tableRow);
    }
    return table;
  }

  getNumRows(tableData: any[][]): number {
    return tableData.length;
  }

  getNumColumns(tableData: any[][]): number {
    let maxColumns = 0;
    for (const row of tableData) {
      if (row.length > maxColumns) {
        maxColumns = row.length;
      }
    }
    return maxColumns;
  }

  showImportingTableDisplay(): void {
    this.isImportingTable = true;
  }

  hideImportingTableDisplay(): void {
    this.isImportingTable = false;
  }

  setImportTableMessage(message: string): void {
    this.importTableMessage = message;
  }
}
