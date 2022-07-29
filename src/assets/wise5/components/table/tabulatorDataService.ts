'use strict';

import { Injectable } from '@angular/core';
import { TabulatorData } from './TabulatorData';

@Injectable()
export class TabulatorDataService {
  constructor() {}

  convertTableDataToTabulator(tableData: any[], globalCellSize: number): TabulatorData {
    const content = new TabulatorData();
    content.columns = this.getTabulatorColumnsFromTable(tableData, globalCellSize);
    for (const [index, row] of tableData.entries()) {
      if (index > 0) {
        const rowIndex = index - 1;
        const rowData = this.getTabulatorRowDataFromTableRow(row, content.columns);
        rowData.values.id = rowIndex;
        content.data.push(rowData.values);
        content.editableCells[rowIndex] = rowData.editableCells;
      }
    }
    return content;
  }

  private getTabulatorColumnsFromTable(tableData: any[], globalCellSize: number): any[] {
    let columns = [];
    const columnDefs = tableData[0];
    if (columnDefs) {
      columnDefs.forEach((columnDef, index) => {
        columns.push(this.getTabulatorColumn(columnDef, index, globalCellSize));
      });
    }
    return columns;
  }

  private getTabulatorColumn(columnDef: any, index: number, globalCellSize: number): any {
    const column: any = {
      title: columnDef.text,
      field: `${index}`
    };
    const width: number = this.getTabulatorColumnWidth(columnDef, globalCellSize);
    if (width) {
      column.width = width;
    }
    return column;
  }

  private getTabulatorColumnWidth(columnDef: any, globalCellSize: number): number {
    let width: number = null;
    const legacyWidth: number = columnDef.size ? columnDef.size : globalCellSize;
    if (columnDef.width) {
      width = columnDef.width;
    } else if (legacyWidth && legacyWidth !== 10) {
      width = legacyWidth * 16; // approximate conversion of legacy column size (em) to number of px
    }
    return width;
  }

  private getTabulatorRowDataFromTableRow(tableRow: any[], columns: any[]): any {
    let rowData = {
      values: {},
      editableCells: []
    };
    tableRow.forEach((cell, index) => {
      const field = columns[index].field;
      rowData.values[field] = cell.text;
      if (cell.editable) {
        rowData.editableCells.push(field);
      }
    });
    return rowData;
  }
}