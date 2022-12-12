import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { TabulatorDataService } from '../tabulatorDataService';
import { TabulatorData } from '../TabulatorData';

@Component({
  selector: 'table-show-work',
  templateUrl: 'table-show-work.component.html',
  styleUrls: ['../table-student/table-student.component.scss', 'table-show-work.component.scss']
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
    protected ProjectService: ProjectService,
    private TabulatorDataService: TabulatorDataService
  ) {
    super(nodeService, ProjectService);
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

  setupTable(): void {
    this.tabulatorData = this.TabulatorDataService.convertTableDataToTabulator(
      this.tableData,
      this.componentContent.globalCellSize
    );
  }

  tabulatorRendered(): void {
    this.nodeService.broadcastDoneRenderingComponent({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }
}
