import { Component } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'table-show-work',
  templateUrl: 'table-show-work.component.html',
  styleUrls: ['../table-student/table-student.component.scss', 'table-show-work.component.scss']
})
export class TableShowWorkComponent extends ComponentShowWorkDirective {
  tableData: any[];
  dataExplorerGraphType: string;
  dataExplorerSeries: any[];
  dataExplorerXAxisLabel: string;
  dataExplorerYAxisLabel: string;
  dataExplorerYAxisLabels: string[];
  xColumnIndex: number;
  columnNames: string[] = [];
  minCellSize: number = 3;
  cellSizeToPixelsMultiplier: number = 10;
  noneText: string = $localize`(None)`;

  constructor(protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const studentData = this.componentState.studentData;
    this.tableData = studentData.tableData;
    this.injectCellWidths(this.tableData);
    if (studentData.isDataExplorerEnabled) {
      this.dataExplorerGraphType = studentData.dataExplorerGraphType;
      this.dataExplorerSeries = studentData.dataExplorerSeries;
      this.dataExplorerXAxisLabel = studentData.dataExplorerXAxisLabel;
      this.dataExplorerYAxisLabel = studentData.dataExplorerYAxisLabel;
      this.dataExplorerYAxisLabels = studentData.dataExplorerYAxisLabels;
      this.xColumnIndex = this.calculateXColumnIndex(this.componentState);
      this.columnNames = this.calculateColumnNames(this.componentState);
    }
  }

  injectCellWidths(tableData: any[]): any[] {
    tableData.forEach((row: any) => {
      row.forEach((cell: any) => {
        cell.width = this.calculateCellWidth(cell);
      });
    });
    return tableData;
  }

  calculateCellWidth(cell: any): number {
    let size = this.componentContent.globalCellSize;
    if (cell.size != null) {
      size = cell.size;
    }
    if (size < this.minCellSize) {
      size = this.minCellSize;
    }
    return size * this.cellSizeToPixelsMultiplier;
  }

  calculateXColumnIndex(componentState: any): number {
    return componentState.studentData.dataExplorerSeries[0].xColumn;
  }

  calculateColumnNames(componentState: any): string[] {
    const tableData: any = componentState.studentData.tableData;
    const firstRow: any = tableData[0];
    const columnNames: string[] = [];
    for (const cell of firstRow) {
      columnNames.push(cell.text);
    }
    return columnNames;
  }
}
