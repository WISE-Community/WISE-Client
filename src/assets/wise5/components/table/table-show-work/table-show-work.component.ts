import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { TabulatorDataService } from '../tabulatorDataService';
import { TabulatorData } from '../TabulatorData';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TabulatorTableComponent
  ],
  selector: 'table-show-work',
  styles: ['.table-container { margin-top: 0; padding: 0; }'],
  templateUrl: 'table-show-work.component.html'
})
export class TableShowWorkComponent extends ComponentShowWorkDirective {
  tableData: any[] = [];
  dataExplorerGraphType: string;
  dataExplorerSeries: any[];
  dataExplorerXAxisLabel: string;
  dataExplorerYAxisLabel: string;
  dataExplorerYAxisLabels: string[];
  selectedRowIndices: number[];
  xColumnIndex: number;
  columnNames: string[] = [];
  noneText: string = $localize`(None)`;
  tabulatorData: TabulatorData;
  tabulatorSorters: any[];

  constructor(
    protected nodeService: NodeService,
    protected projectService: ProjectService,
    private tabulatorDataService: TabulatorDataService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const studentData = this.componentState.studentData;
    this.tableData = studentData.tableData;
    this.selectedRowIndices = studentData.selectedRowIndices ? studentData.selectedRowIndices : [];
    this.tabulatorSorters = studentData.tabulatorSorters ? studentData.tabulatorSorters : [];
    if (studentData.isDataExplorerEnabled) {
      this.dataExplorerGraphType = studentData.dataExplorerGraphType;
      this.dataExplorerSeries = studentData.dataExplorerSeries;
      this.dataExplorerXAxisLabel = studentData.dataExplorerXAxisLabel;
      this.dataExplorerYAxisLabel = studentData.dataExplorerYAxisLabel;
      this.dataExplorerYAxisLabels = studentData.dataExplorerYAxisLabels;
      this.xColumnIndex = this.calculateXColumnIndex(this.componentState);
      this.columnNames = this.calculateColumnNames(this.componentState);
    }
    this.setupTable();
  }

  private calculateXColumnIndex(componentState: any): number {
    return componentState.studentData.dataExplorerSeries[0].xColumn;
  }

  private calculateColumnNames(componentState: any): string[] {
    const tableData: any = componentState.studentData.tableData;
    const firstRow: any = tableData[0];
    const columnNames: string[] = [];
    for (const cell of firstRow) {
      columnNames.push(cell.text);
    }
    return columnNames;
  }

  private setupTable(): void {
    this.tabulatorData = this.tabulatorDataService.convertTableDataToTabulator(
      this.tableData,
      this.componentContent.globalCellSize
    );
  }

  protected tabulatorRendered(): void {
    this.nodeService.broadcastDoneRenderingComponent({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }
}
