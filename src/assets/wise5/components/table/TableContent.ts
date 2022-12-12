import { ComponentContent } from '../../common/ComponentContent';

export interface TableContent extends ComponentContent {
  dataExplorerDataToColumn: any;
  dataExplorerGraphTypes: any;
  dataExplorerSeriesParams: any;
  enableRowSelection: boolean;
  isDataExplorerAxisLabelsEditable: boolean;
  isDataExplorerEnabled: boolean;
  numColumns: number;
  numDataExplorerSeries: number;
  numDataExplorerYAxis: number;
  numRows: number;
  tableData: any;
}
