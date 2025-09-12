import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { EditComponentDefaultFeedback } from '../../../../../app/authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditComponentConstraintsComponent } from '../../../../../app/authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { CSVToArray } from '../../../common/array/array';
import { EditTableConnectedComponentsComponent } from '../edit-table-connected-components/edit-table-connected-components.component';
import { TableContent } from '../TableContent';

@Component({
  templateUrl: 'edit-table-advanced.component.html',
  styleUrl: 'edit-table-advanced.component.scss',
  imports: [
    MatCheckbox,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    MatSelectModule,
    MatIcon,
    MatTooltip,
    MatButton,
    MatProgressSpinner,
    EditComponentAddToNotebookButtonComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentMaxSubmitComponent,
    EditComponentDefaultFeedback,
    EditComponentMaxScoreComponent,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentWidthComponent,
    EditComponentRubricComponent,
    EditComponentTagsComponent,
    EditTableConnectedComponentsComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent
  ]
})
export class EditTableAdvancedComponent extends EditAdvancedComponentComponent {
  MAX_ALLOWED_CELLS_IN_IMPORT = 2000;

  allowedConnectedComponentTypes = ['Embedded', 'Graph', 'Table'];
  componentContent: TableContent;
  columnNames: string[] = [];
  isDataExplorerScatterPlotEnabled: boolean;
  isDataExplorerLineGraphEnabled: boolean;
  isDataExplorerBarGraphEnabled: boolean;
  isImportingTable: boolean = false;
  numColumns: number;
  importTableMessage: string;

  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentContent.isDataExplorerEnabled) {
      this.repopulateDataExplorerGraphTypes();
      this.initializeDataExplorerSeriesParams();
      this.tryInitializeDataExplorerDataToColumn();
    }
    this.numColumns = this.getNumTableColumns(this.componentContent);
    this.columnNames = this.getColumnNames(this.componentContent);
  }

  initializeDataExplorerSeriesParams(): void {
    if (this.componentContent.dataExplorerSeriesParams == null) {
      this.componentContent.dataExplorerSeriesParams = [];
      for (let s = 0; s < this.componentContent.numDataExplorerSeries; s++) {
        this.componentContent.dataExplorerSeriesParams.push({});
      }
    }
  }

  initializeDataExplorerGraphTypes(): void {
    this.componentContent.dataExplorerGraphTypes = [];
    this.componentContent.dataExplorerGraphTypes.push(
      this.createGraphTypeObject('Scatter Plot', 'scatter')
    );
  }

  repopulateDataExplorerGraphTypes(): void {
    this.isDataExplorerScatterPlotEnabled = false;
    this.isDataExplorerLineGraphEnabled = false;
    this.isDataExplorerBarGraphEnabled = false;
    for (const graphType of this.componentContent.dataExplorerGraphTypes) {
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
    if (this.componentContent.dataExplorerDataToColumn == null) {
      this.componentContent.dataExplorerDataToColumn = {};
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
    if (this.componentContent.isDataExplorerEnabled) {
      if (this.componentContent.dataExplorerGraphTypes == null) {
        this.initializeDataExplorerGraphTypes();
        this.repopulateDataExplorerGraphTypes();
      }
      if (this.componentContent.numDataExplorerSeries == null) {
        this.componentContent.numDataExplorerSeries = 1;
      }
      if (this.componentContent.numDataExplorerYAxis == null) {
        this.componentContent.numDataExplorerYAxis = 1;
      }
      if (this.componentContent.isDataExplorerAxisLabelsEditable == null) {
        this.componentContent.isDataExplorerAxisLabelsEditable = false;
      }
      if (this.componentContent.dataExplorerSeriesParams == null) {
        this.componentContent.dataExplorerSeriesParams = [{}];
      }
      if (this.componentContent.dataExplorerDataToColumn == null) {
        this.componentContent.dataExplorerDataToColumn = {};
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
    const graphTypes = this.componentContent.dataExplorerGraphTypes;
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
    const count = this.componentContent.numDataExplorerSeries;
    if (this.componentContent.dataExplorerSeriesParams.length < count) {
      this.increaseNumDataExplorerSeries(count);
    } else if (this.componentContent.dataExplorerSeriesParams.length > count) {
      this.decreaseNumDataExplorerSeries(count);
    }
    this.componentChanged();
  }

  increaseNumDataExplorerSeries(count: number): void {
    const numToAdd = count - this.componentContent.dataExplorerSeriesParams.length;
    for (let s = 0; s < numToAdd; s++) {
      this.componentContent.dataExplorerSeriesParams.push({});
    }
  }

  decreaseNumDataExplorerSeries(count: number): void {
    this.componentContent.dataExplorerSeriesParams =
      this.componentContent.dataExplorerSeriesParams.slice(0, count);
  }

  numDataExplorerYAxisChanged(): void {
    this.updateDataExplorerSeriesParamsYAxis();
    this.componentChanged();
  }

  updateDataExplorerSeriesParamsYAxis(): void {
    for (const params of this.componentContent.dataExplorerSeriesParams) {
      if (params.yAxis >= this.componentContent.numDataExplorerYAxis) {
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
        const tableContent = CSVToArray(fileContent);
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

  getNumCells(tableContent: (string | number)[][]): number {
    let numCells = 0;
    for (const row of tableContent) {
      numCells += row.length;
    }
    return numCells;
  }

  importTable(tableContent: (string | number)[][]): void {
    const tableData = this.convertToTableData(tableContent);
    this.componentContent.tableData = tableData;
    this.componentContent.numRows = this.getNumRows(tableData);
    this.componentContent.numColumns = this.getNumColumns(tableData);
    this.componentChanged();
  }

  convertToTableData(array: (string | number)[][]): any[][] {
    const table = [];
    for (const row of array) {
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
