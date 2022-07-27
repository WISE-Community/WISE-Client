'use strict';

import * as html2canvas from 'html2canvas';
import { ComponentService } from '../componentService';
import { StudentAssetService } from '../../services/studentAssetService';
import { UtilService } from '../../services/utilService';
import { Injectable } from '@angular/core';
import { TabulatorData } from './TabulatorData';

@Injectable()
export class TableService extends ComponentService {
  $translate: any;

  constructor(
    private StudentAssetService: StudentAssetService,
    protected UtilService: UtilService
  ) {
    super(UtilService);
  }

  getComponentTypeLabel(): string {
    return $localize`Table`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'Table';
    component.globalCellSize = 10;
    component.numRows = 3;
    component.numColumns = 3;
    component.tableData = [
      [
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        }
      ],
      [
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        }
      ],
      [
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        }
      ]
    ];
    return component;
  }

  getTableId(nodeId: string, componentId: string): string {
    return `table-${nodeId}-${componentId}`;
  }

  isCompleted(component, componentStates, nodeEvents, node) {
    if (!this.componentHasEditableCells(component)) {
      /*
       * The component does not have any editable cells so we will say
       * it is completed.
       */
      return true;
    }
    if (componentStates != null && componentStates.length > 0) {
      const submitRequired = this.isSubmitRequired(node, component);
      for (let c = 0, l = componentStates.length; c < l; c++) {
        const componentState = componentStates[c];
        const studentData = componentState.studentData;
        if (studentData != null) {
          const tableData = studentData.tableData;
          if (tableData != null) {
            // there is a table data so the component has saved work
            // TODO: check for actual student data from the table (compare to starting state)
            if (submitRequired) {
              // completion requires a submission, so check for isSubmit
              if (componentState.isSubmit) {
                return true;
              }
            } else {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Check if a table component has any editable cells.
   * @param component The component content.
   * @return Whether the component has any editable cells.
   */
  componentHasEditableCells(component) {
    const tableData = component.tableData;
    if (tableData != null) {
      for (let r = 0; r < tableData.length; r++) {
        const row = tableData[r];
        if (row != null) {
          for (let c = 0; c < row.length; c++) {
            const cell = row[c];
            if (cell != null) {
              if (cell.editable === true) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  componentStateHasStudentWork(componentState, componentContent) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null) {
        const studentTableData = studentData.tableData;
        const componentContentTableData = componentContent.tableData;
        if (studentTableData != null) {
          const studentRows = studentTableData;
          for (let r = 0; r < studentRows.length; r++) {
            const studentRow = studentRows[r];
            if (studentRow != null) {
              for (let c = 0; c < studentRow.length; c++) {
                const studentCell = this.getTableDataCellValue(r, c, studentTableData);
                const componentContentCell = this.getTableDataCellValue(
                  r,
                  c,
                  componentContentTableData
                );
                if (studentCell !== componentContentCell) {
                  /*
                   * the cell values are not the same which means
                   * the student has changed the table
                   */
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Get the value of a cell in the table
   * @param x the x coordinate
   * @param y the y coordinate
   * @param table (optional) table data to get the value from. this is used
   * when we want to look up the value in the default authored table
   * @returns the cell value (text or a number)
   */
  getTableDataCellValue(x, y, table) {
    if (table != null) {
      const row = table[y];
      if (row != null) {
        const cell = row[x];
        if (cell != null) {
          return cell.text;
        }
      }
    }
    return null;
  }

  /**
   * The component state has been rendered in a <component></component> element
   * and now we want to take a snapshot of the work.
   * @param componentState The component state that has been rendered.
   * @return A promise that will return an image object.
   */
  generateImageFromRenderedComponentState(componentState) {
    const promise = new Promise((resolve, reject) => {
      let tableElement = document.querySelector(
        `#table-${componentState.nodeId}-${componentState.componentId}`
      );
      if (tableElement != null) {
        // convert the table element to a canvas element
        html2canvas(tableElement).then((canvas) => {
          // get the canvas as a base64 string
          const img_b64 = canvas.toDataURL('image/png');

          // get the image object
          const imageObject = this.UtilService.getImageObjectFromBase64String(img_b64);

          // add the image to the student assets
          this.StudentAssetService.uploadAsset(imageObject).then((asset) => {
            resolve(asset);
          });
        });
      }
    });
    return promise;
  }

  hasRequiredNumberOfFilledRows(
    componentState,
    requiredNumberOfFilledRows,
    tableHasHeaderRow,
    requireAllCellsInARowToBeFilled
  ) {
    const rows = componentState.studentData.tableData;
    let firstStudentRow = 0;
    if (tableHasHeaderRow) {
      firstStudentRow = 1;
    }
    let filledRows = 0;
    for (let r = firstStudentRow; r < rows.length; r++) {
      const row = rows[r];
      if (this.isRowFilled(row, requireAllCellsInARowToBeFilled)) {
        filledRows++;
      }
    }
    return filledRows >= requiredNumberOfFilledRows;
  }

  isRowFilled(row, requireAllCellsInARowToBeFilled) {
    if (requireAllCellsInARowToBeFilled) {
      return this.isAllCellsFilledInRow(row);
    } else {
      return this.isAtLeastOneCellFilledInRow(row);
    }
  }

  isAllCellsFilledInRow(row) {
    for (const c of row) {
      if (c.text == null || c.text == '') {
        return false;
      }
    }
    return true;
  }

  isAtLeastOneCellFilledInRow(row) {
    for (const c of row) {
      if (c.text != null && c.text != '') {
        return true;
      }
    }
    return false;
  }

  convertTableDataToTabulator(tableData: any, globalCellSize: number): TabulatorData {
    const content = new TabulatorData();
    content.columns = this.getTabulatorColumnsFromTable(tableData, globalCellSize);
    for (const [index, row] of tableData.entries()) {
      if (index > 0) {
        const rowData = this.getTabulatorRowDataFromTableRow(row, content.columns)
        content.data.push(rowData.values);
        content.editableCells[index-1] = rowData.editableCells;
      }
    }
    return content;
  }

  private getTabulatorColumnsFromTable(tableData: any[], globalCellSize: number): any {
    let columns = [];
    const columnDefs = tableData[0];
    columnDefs.forEach((columnDef, index) => {
      columns.push(this.getTabulatorColumn(columnDef, index, globalCellSize))
    });
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
      width = legacyWidth * 16; // approzimate conversion of legacy column size based on em measurements
    }
    return width;
  }

  private getTabulatorRowDataFromTableRow(tableRow, columns): any {
    let rowData = {
      values: [],
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
