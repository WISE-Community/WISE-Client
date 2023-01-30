'use strict';

import * as html2canvas from 'html2canvas';
import { ComponentService } from '../componentService';
import { StudentAssetService } from '../../services/studentAssetService';
import { Injectable } from '@angular/core';
import { convertToPNGFile } from '../../common/canvas/canvas';

@Injectable()
export class TableService extends ComponentService {
  constructor(private StudentAssetService: StudentAssetService) {
    super();
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
        return (
          this.studentDataHasSelectedRows(studentData) ||
          this.studentDataHasTableData(studentData, componentContent)
        );
      }
    }
  }

  private studentDataHasSelectedRows(studentData: any): boolean {
    return studentData.selectedRowIndices != null;
  }

  private studentDataHasTableData(studentData: any, componentContent: any): boolean {
    const studentTableData = studentData.tableData;
    if (studentTableData != null) {
      const componentContentTableData = componentContent.tableData;
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
          const pngFile = convertToPNGFile(canvas);
          this.StudentAssetService.uploadAsset(pngFile).then((asset) => {
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
}
