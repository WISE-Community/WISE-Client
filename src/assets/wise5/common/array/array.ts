/**
 * Parse a delimited string into an array of arrays.
 * Source: http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
 */
export function CSVToArray(strData: string, strDelimiter: string = ','): (string | number)[][] {
  strDelimiter = strDelimiter || ',';

  // Create a regular expression to parse the CSV values
  const objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi'
  );

  const arrData = [[]];
  let arrMatches = null;

  // Loop over the regular expression matches until we can no longer find a match
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    const strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length (is not the start of string) and if it
    // matches field delimiter. If it does not, then we know that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
      // Since we have reached a new row of data, add an empty row to our data array.
      arrData.push([]);
    }

    // Check to see which kind of value we captured (quoted or unquoted)
    let strMatchedValue;
    if (arrMatches[2]) {
      // We found a quoted value. When we capture this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Add value string to the data array
    let finalValue = strMatchedValue;
    const floatVal = parseFloat(strMatchedValue.replace(new RegExp(',', 'g'), ''));
    if (!isNaN(floatVal)) {
      finalValue = floatVal;
    }
    arrData[arrData.length - 1].push(finalValue);
  }
  return arrData;
}

export function getIntersectOfArrays(array1: any[], array2: any[]): any[] {
  return array1.filter((n) => {
    return array2.includes(n);
  });
}
