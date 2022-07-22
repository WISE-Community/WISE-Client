import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-table-advanced',
  templateUrl: 'edit-table-advanced.component.html',
  styleUrls: ['edit-table-advanced.component.scss']
})
export class EditTableAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Embedded', 'Graph', 'Table'];
  columnNames: string[] = [];
  isDataExplorerScatterPlotEnabled: boolean;
  isDataExplorerLineGraphEnabled: boolean;
  isDataExplorerBarGraphEnabled: boolean;
  numColumns: number;
  importTableMessage: string;

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected TeacherProjectService: TeacherProjectService
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
      const files = event.target.files;
      const reader: any = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        this.importTable(fileContent);
        event.target.value = null;
        this.importTableMessage = $localize`Successfully imported table`;
      };
      reader.readAsText(files[0]);
    } else {
      event.target.value = null;
    }
  }

  importTable(fileContent: string): void {
    const twoDimensionalStringArray = this.csvToArray(fileContent);
    const tableData = this.convertToTableData(twoDimensionalStringArray);
    this.authoringComponentContent.tableData = tableData;
    this.authoringComponentContent.numRows = this.getNumRows(tableData);
    this.authoringComponentContent.numColumns = this.getNumColumns(tableData);
    this.componentChanged();
  }

  /**
   * This function was obtained from this blog post
   * https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
   */
  csvToArray(strData: string, strDelimiter: string = ','): string[][] {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ',';

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      // Delimiters.
      '(\\' +
        strDelimiter +
        '|\\r?\\n|\\r|^)' +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        '\\r\\n]*))',
      'gi'
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
  }

  convertToTableData(stringArray: string[][]): any[][] {
    const table = [];
    for (const row of stringArray) {
      const tableRow = [];
      for (const cell of row) {
        tableRow.push({
          text: cell,
          editable: true,
          size: null
        });
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
}
