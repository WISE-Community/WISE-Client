import * as FileSaver from 'file-saver';

/**
 * Generate the csv file and have the client download it
 * @param rows a 2D array that represents the rows in the export
 * each row contains an array. the inner array contains strings or
 * numbers which represent the cell values in the export.
 * @param fileName the name of the file that will be generated
 */
export function generateCSVFile(rows: any[], fileName: string): void {
  var csvString = '';
  if (rows != null) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (row != null) {
        for (var c = 0; c < row.length; c++) {
          var cell = row[c];
          if (cell == null || cell === '' || typeof cell === 'undefined') {
            cell = ' ';
          } else if (typeof cell === 'object') {
            /*
             * the cell value is an object so we will obtain the
             * string representation of the object and wrap it
             * in quotes
             */
            cell = JSON.stringify(cell);
            cell = cell.replace(/"/g, '""');
            if (cell != null && cell.length >= 32767) {
              /*
               * the cell value is larger than the allowable
               * excel cell size so we will display the string
               * "Data Too Large" instead
               */
              cell = 'Data Too Large';
            }
            cell = '"' + cell + '"';
          } else if (typeof cell === 'string') {
            if (cell != null && cell.length >= 32767) {
              /*
               * the cell value is larger than the allowable
               * excel cell size so we will display the string
               * "Data Too Large" instead
               */
              cell = 'Data Too Large';
            }
            cell = cell.replace(/"/g, '""');
            cell = '"' + cell + '"';
          }
          csvString += cell + ',';
        }
        csvString += '\r\n';
      }
    }
  }
  const csvBlob = new Blob([csvString], { type: 'text/csv; charset=utf-8' });
  FileSaver.saveAs(csvBlob, fileName);
}
