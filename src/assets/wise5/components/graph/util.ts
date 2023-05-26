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
  if (xText != null && xText !== '' && yText != null && yText !== '') {
    data.push(createDataPointFromTable(xText, yText, tooltipHeader));
  } else {
    data.push([]);
  }
}

function createDataPointFromTable(xText: string, yText: string, tooltipHeader: string): any {
  let point: any;
  const xNumber = Number(xText);
  const yNumber = Number(yText);
  if (!isNaN(xNumber) && !isNaN(yNumber)) {
    point = {
      x: xNumber,
      y: yNumber
    };
    if (tooltipHeader != null) {
      point.tooltipHeader = tooltipHeader;
    }
  } else {
    point = [];
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
  }
  return point;
}
