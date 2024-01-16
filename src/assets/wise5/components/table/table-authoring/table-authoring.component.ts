'use strict';

import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'table-authoring',
  templateUrl: 'table-authoring.component.html',
  styleUrls: ['table-authoring.component.scss']
})
export class TableAuthoring extends AbstractComponentAuthoring {
  protected columnCellSizes: any;
  protected dimensionsForm: FormGroup;
  protected frozenColumns: any;
  protected frozenColumnsLimitReached: boolean = false;
  protected globalCellSizeChange: Subject<number> = new Subject<number>();
  private numColumnsFormControl: FormControl;
  private numRowsFormControl: FormControl;

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeDimensionInputs();
    this.subscriptions.add(
      this.globalCellSizeChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
    this.columnCellSizes = this.parseColumnCellSizes(this.componentContent);
    this.frozenColumns = this.parseFrozenColumns(this.componentContent);
  }

  private initializeDimensionInputs(): void {
    this.initializeColumnInput();
    this.initializeRowInput();
    this.dimensionsForm = new FormGroup({
      numColumnsFormControl: this.numColumnsFormControl,
      numRowsFormControl: this.numRowsFormControl
    });
  }

  private initializeColumnInput(): void {
    this.numColumnsFormControl = this.createDimensionFormControl(this.componentContent.numColumns);
    this.subscriptions.add(
      this.numColumnsFormControl.valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((value: number): void => {
          if (this.numColumnsFormControl.valid) {
            this.componentContent.numColumns = value;
            this.tableNumColumnsChanged();
          }
        })
    );
  }

  private initializeRowInput(): void {
    this.numRowsFormControl = this.createDimensionFormControl(this.componentContent.numRows);
    this.subscriptions.add(
      this.numRowsFormControl.valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((value: number): void => {
          if (this.numRowsFormControl.valid) {
            this.componentContent.numRows = value;
            this.tableNumRowsChanged();
          }
        })
    );
  }

  private createDimensionFormControl(initialValue: number): FormControl {
    return new FormControl(initialValue, [Validators.required, this.positiveNumberValidator()]);
  }

  private positiveNumberValidator(): ValidatorFn {
    return (control: FormControl) => {
      if (control.value < 1) {
        return { invalid: true };
      }
    };
  }

  tableNumRowsChanged(): void {
    const oldValue = this.getNumRowsInTableData();
    const newValue = this.componentContent.numRows;
    if (newValue < oldValue) {
      if (this.areRowsAfterEmpty(newValue)) {
        this.tableSizeChanged();
      } else {
        if (confirm($localize`Are you sure you want to decrease the number of rows?`)) {
          this.tableSizeChanged();
        } else {
          this.componentContent.numRows = oldValue;
        }
      }
    } else {
      this.tableSizeChanged();
    }
  }

  areRowsAfterEmpty(rowIndex: number): boolean {
    const oldNumRows = this.getNumRowsInTableData();
    for (let r = rowIndex; r < oldNumRows; r++) {
      if (!this.isRowEmpty(r)) {
        return false;
      }
    }
    return true;
  }

  isRowEmpty(rowIndex: number): boolean {
    const tableData = this.componentContent.tableData;
    for (const cell of tableData[rowIndex]) {
      if (!this.isEmpty(cell.text)) {
        return false;
      }
    }
    return true;
  }

  tableNumColumnsChanged(): void {
    const oldValue = this.getNumColumnsInTableData();
    const newValue = this.componentContent.numColumns;
    if (newValue < oldValue) {
      if (this.areColumnsAfterEmpty(newValue)) {
        this.tableSizeChanged();
      } else {
        if (confirm($localize`Are you sure you want to decrease the number of columns?`)) {
          this.tableSizeChanged();
        } else {
          this.componentContent.numColumns = oldValue;
        }
      }
    } else {
      this.tableSizeChanged();
    }
  }

  areColumnsAfterEmpty(columnIndex: number): boolean {
    const oldNumColumns = this.getNumColumnsInTableData();
    for (let c = columnIndex; c < oldNumColumns; c++) {
      if (!this.isColumnEmpty(c)) {
        return false;
      }
    }
    return true;
  }

  isColumnEmpty(columnIndex: number): boolean {
    for (const row of this.componentContent.tableData) {
      const cell = row[columnIndex];
      if (!this.isEmpty(cell.text)) {
        return false;
      }
    }
    return true;
  }

  isEmpty(txt: string): boolean {
    return txt == null || txt == '';
  }

  tableSizeChanged(): void {
    this.componentContent.tableData = this.getUpdatedTable(
      this.componentContent.numRows,
      this.componentContent.numColumns
    );
    this.componentChanged();
  }

  /**
   * Create a table with the given dimensions. Populate the cells with the cells from the old table.
   * @param newNumRows the number of rows in the new table
   * @param newNumColumns the number of columns in the new table
   * @returns a new table
   */
  getUpdatedTable(newNumRows: number, newNumColumns: number): any {
    const newTable = [];
    for (let r = 0; r < newNumRows; r++) {
      const newRow = [];
      for (let c = 0; c < newNumColumns; c++) {
        let cell = this.getCellObjectFromTableData(c, r);
        if (cell == null) {
          cell = this.createEmptyCell();
        }
        newRow.push(cell);
      }
      newTable.push(newRow);
    }
    return newTable;
  }

  /**
   * Get the cell object at the given x, y location
   * @param x the column number (zero indexed)
   * @param y the row number (zero indexed)
   * @returns the cell at the given x, y location or null if there is none
   */
  getCellObjectFromTableData(x: number, y: number): any {
    let cellObject = null;
    const tableData = this.componentContent.tableData;
    if (tableData != null) {
      const row = tableData[y];
      if (row != null) {
        cellObject = row[x];
      }
    }
    return cellObject;
  }

  createEmptyCell(): any {
    return {
      text: '',
      editable: true,
      size: null
    };
  }

  insertRow(rowIndex: number): void {
    const tableData = this.componentContent.tableData;
    const newRow = [];
    const numColumns = this.componentContent.numColumns;
    for (let c = 0; c < numColumns; c++) {
      const newCell = this.createEmptyCell();
      const cellSize = this.columnCellSizes[c];
      if (cellSize != null) {
        newCell.size = cellSize;
      }
      newRow.push(newCell);
    }
    tableData.splice(rowIndex, 0, newRow);
    this.componentContent.numRows++;
    this.numRowsFormControl.setValue(this.componentContent.numRows);
    this.componentChanged();
  }

  deleteRow(rowIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this row?`)) {
      const tableData = this.componentContent.tableData;
      if (tableData != null) {
        tableData.splice(rowIndex, 1);
        this.componentContent.numRows--;
      }
      this.numRowsFormControl.setValue(this.componentContent.numRows);
      this.componentChanged();
    }
  }

  insertColumn(columnIndex: number): void {
    const tableData = this.componentContent.tableData;
    const numRows = this.componentContent.numRows;
    for (let r = 0; r < numRows; r++) {
      const row = tableData[r];
      const newCell = this.createEmptyCell();
      row.splice(columnIndex, 0, newCell);
    }
    this.componentContent.numColumns++;
    this.parseColumnCellSizes(this.componentContent);
    this.parseFrozenColumns(this.componentContent);
    this.numColumnsFormControl.setValue(this.componentContent.numColumns);
    this.componentChanged();
  }

  deleteColumn(columnIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this column?`)) {
      const tableData = this.componentContent.tableData;
      const numRows = this.componentContent.numRows;
      for (let r = 0; r < numRows; r++) {
        const row = tableData[r];
        row.splice(columnIndex, 1);
      }
      this.componentContent.numColumns--;
      this.parseColumnCellSizes(this.componentContent);
      this.parseFrozenColumns(this.componentContent);
      this.numColumnsFormControl.setValue(this.componentContent.numColumns);
      this.componentChanged();
    }
  }

  /**
   * Get the number of rows in the table data. This is slightly different from just getting the
   * numRows field in the component content. Usually the number of rows will be the same. In some
   * cases it can be different such as during authoring immediately after the author changes the
   * number of rows using the number of rows input.
   * @return {number} The number of rows in the table data.
   */
  getNumRowsInTableData(): number {
    return this.componentContent.tableData.length;
  }

  /**
   * Get the number of columns in the table data. This is slightly different from just getting the
   * numColumns field in the component content. Usually the number of columns will be the same. In
   * some cases it can be different such as during authoring immediately after the author changes
   * the number of columns using the number of columns input.
   * @return {number} The number of columns in the table data.
   */
  getNumColumnsInTableData(): number {
    const tableData = this.componentContent.tableData;
    if (tableData.length > 0) {
      return tableData[0].length;
    }
    return 0;
  }

  setAllCellsUneditable(): void {
    this.setAllCellsIsEditable(false);
    this.componentChanged();
  }

  setAllCellsEditable(): void {
    this.setAllCellsIsEditable(true);
    this.componentChanged();
  }

  setAllCellsIsEditable(isEditable: boolean): void {
    for (const row of this.componentContent.tableData) {
      for (const cell of row) {
        cell.editable = isEditable;
      }
    }
  }

  /**
   * Parse the column cell sizes. We will get the column cell sizes by looking at the size value of
   * each cell in the first row.
   * @param componentContent the component content
   */
  parseColumnCellSizes(componentContent: any): any {
    const columnCellSizes = {};
    const tableData = componentContent.tableData;
    const firstRow = tableData[0];
    for (let x = 0; x < firstRow.length; x++) {
      const cell = firstRow[x];
      columnCellSizes[x] = cell.size;
    }
    return columnCellSizes;
  }

  columnSizeChanged(index: number): void {
    let cellSize = this.columnCellSizes[index];
    if (cellSize == '') {
      cellSize = null;
    }
    this.setColumnCellSize(index, cellSize);
  }

  private setColumnCellSize(column: number, size: number): void {
    const tableData = this.componentContent.tableData;
    const firstRow = tableData[0];
    const cell = firstRow[column];
    if (cell != null) {
      cell.size = size;
    }
    this.componentChanged();
  }

  private parseFrozenColumns(componentContent: any): any {
    const frozenColumns = {};
    const firstRow = componentContent.tableData[0];
    for (const key in firstRow) {
      const cell = firstRow[key];
      frozenColumns[key] = cell.frozen;
    }
    this.frozenColumnsLimitReached = this.isfrozenColumnsLimitReached();
    return frozenColumns;
  }

  frozenColumnsChanged(index: number): void {
    let frozen = this.frozenColumns[index];
    const firstRow = this.componentContent.tableData[0];
    const cell = firstRow[index];
    if (cell != null) {
      cell.frozen = frozen;
    }
    this.componentChanged();
    this.frozenColumnsLimitReached = this.isfrozenColumnsLimitReached();
  }

  private isfrozenColumnsLimitReached(): boolean {
    const firstRow = this.componentContent.tableData[0];
    let count = 0;
    for (const key in firstRow) {
      if (firstRow[key].frozen) {
        count++;
      }
    }
    const maxFrozen = firstRow.length - 1;
    return count === maxFrozen;
  }

  automaticallySetConnectedComponentFieldsIfPossible(connectedComponent) {
    if (connectedComponent.type === 'importWork' && connectedComponent.action == null) {
      connectedComponent.action = 'merge';
    } else if (connectedComponent.type === 'showWork') {
      connectedComponent.action = null;
    }
  }

  connectedComponentTypeChanged(connectedComponent) {
    this.automaticallySetConnectedComponentFieldsIfPossible(connectedComponent);
    this.componentChanged();
  }

  protected isNumberChar(event: any): boolean {
    return event.charCode >= 48 && event.charCode <= 57;
  }
}
