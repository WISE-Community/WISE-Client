'use strict';

import * as FileSaver from 'file-saver';

class ExportController {
  maxExcelCellSize: number = 32767;

  constructor() {}

  /**
   * Generate the csv file and have the client download it
   * @param rows a 2D array that represents the rows in the export. each row contains an array. the
   * inner array contains strings or numbers which represent the cell values in the export.
   * @param fileName the name of the file that will be generated
   */
  generateCSVFile(rows: any[], fileName: string): void {
    const csvString = this.generateCSVString(rows);
    const csvBlob = new Blob([csvString], { type: 'text/csv' });
    FileSaver.saveAs(csvBlob, fileName);
  }

  private generateCSVString(rows: any[]): string {
    let csvString = '';
    for (const row of rows) {
      csvString += this.createCSVRow(row);
    }
    return csvString;
  }

  private createCSVRow(row: any[]): string {
    let csvString = '';
    for (const cell of row) {
      csvString += `${this.createCSVCell(cell)},`;
    }
    csvString += '\r\n';
    return csvString;
  }

  private createCSVCell(cell: any): string {
    let csvString = '';
    if (this.isEmpty(cell)) {
      csvString = ' ';
    } else if (this.isObject(cell)) {
      csvString = JSON.stringify(cell);
      csvString = csvString.replace(/"/g, '""');
      csvString = this.wrapInDoubleQuotes(csvString);
    } else if (this.isString(cell)) {
      csvString = this.wrapInDoubleQuotes(cell);
    } else {
      csvString = cell;
    }
    if (this.isStringTooLarge(csvString)) {
      csvString = 'Data Too Large';
    }
    return csvString;
  }

  private isEmpty(data: any): boolean {
    return data == null || data === '' || typeof data === 'undefined';
  }

  private isObject(data: any): boolean {
    return typeof data === 'object';
  }

  private isString(data: any): boolean {
    return typeof data === 'string';
  }

  private wrapInDoubleQuotes(str: string): string {
    return `"${str}"`;
  }

  private isStringTooLarge(str: string): boolean {
    return str.length >= this.maxExcelCellSize;
  }
}

export default ExportController;
