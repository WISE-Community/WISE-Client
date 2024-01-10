export function calculateMean(values: number[]): number {
  return values.reduce((a, b) => a + b) / values.length;
}

export function isSingleYAxis(yAxis: any): boolean {
  return !Array.isArray(yAxis);
}

export function isMultipleYAxes(yAxis: any): boolean {
  return Array.isArray(yAxis);
}

export function addPointFromTableIntoData(
  xCell: any,
  yCell: any,
  data: any[],
  tooltipHeader: string
): void {
  const xText = xCell.text;
  const yText = yCell.text;
  if (!isEmpty(xText) && !isEmpty(yText)) {
    data.push(createDataPointFromTable(xText, yText, tooltipHeader));
  } else {
    data.push([]);
  }
}

function isEmpty(value: any): boolean {
  return value == null || value === '';
}

function createDataPointFromTable(xText: string, yText: string, tooltipHeader: string): any {
  const xNumber = Number(xText);
  const yNumber = Number(yText);
  return !isNaN(xNumber) && !isNaN(yNumber)
    ? createPointObject(xNumber, yNumber, tooltipHeader)
    : createPointArray(xNumber, xText, yNumber);
}

function createPointObject(xNumber: number, yNumber: number, tooltipHeader: string): any {
  const point: any = {
    x: xNumber,
    y: yNumber
  };
  if (tooltipHeader != null) {
    point.tooltipHeader = tooltipHeader;
  }
  return point;
}

function createPointArray(xNumber: number, xText: string, yNumber: number): any[] {
  const point = [];
  if (!isNaN(xNumber)) {
    point.push(xNumber);
  } else {
    point.push(xText);
  }
  if (!isNaN(yNumber)) {
    point.push(yNumber);
  } else {
    point.push(null);
  }
  return point;
}
