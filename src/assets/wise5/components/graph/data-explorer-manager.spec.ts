import { DataExplorerManager } from './data-explorer-manager';

let activeTrial: any;
const blueColor: string = 'blue';
const casesColumnName: string = 'Cases per 100,000';
let component: DataExplorerManager;

describe('DataExplorerManager', () => {
  beforeEach(() => {
    const xAxis = {
      title: {
        text: ''
      }
    };
    const yAxis = {
      title: {
        text: ''
      }
    };
    activeTrial = {
      series: []
    };
    component = new DataExplorerManager(xAxis, yAxis, activeTrial);
  });

  handleDataExplorer();
});

function handleDataExplorer() {
  describe('handleDataExplorer()', () => {
    it('should process data explorer student data when x column contains numbers', () => {
      const studentData = createStudentData(
        [
          [{ text: '% in poverty' }, { text: casesColumnName }],
          [{ text: '10' }, { text: '100' }],
          [{ text: '20' }, { text: '200' }]
        ],
        true
      );
      expect(activeTrial.series).toEqual([]);
      const regressionSeries = component.handleDataExplorer(studentData);
      expect(activeTrial.series).toEqual([
        {
          type: 'scatter',
          name: casesColumnName,
          color: blueColor,
          yAxis: 0,
          data: [
            { x: 10, y: 100 },
            { x: 20, y: 200 }
          ]
        }
      ]);
      expect(regressionSeries).toEqual([
        {
          type: 'line',
          name: 'Regression Line',
          color: blueColor,
          data: [
            [10, 100],
            [20, 200]
          ],
          yAxis: 0,
          enableMouseTracking: false
        }
      ]);
    });

    it('should process data explorer student data when x column contains labels', () => {
      const studentData = createStudentData(
        [
          [{ text: 'County' }, { text: casesColumnName }],
          [{ text: 'Alameda' }, { text: '100' }],
          [{ text: 'Contra Costa' }, { text: '200' }]
        ],
        false
      );
      expect(activeTrial.series).toEqual([]);
      component.handleDataExplorer(studentData);
      expect(activeTrial.series).toEqual([
        {
          type: 'scatter',
          name: casesColumnName,
          color: blueColor,
          yAxis: 0,
          data: [
            ['Alameda', 100],
            ['Contra Costa', 200]
          ]
        }
      ]);
    });
  });
}

function createStudentData(tableData: any[][], isRegressionEnabled: boolean): any {
  return {
    dataExplorerSeries: [
      {
        name: casesColumnName,
        xColumn: 0,
        yAxis: 0,
        yColumn: 1
      }
    ],
    dataExplorerGraphType: 'scatter',
    isDataExplorerScatterPlotRegressionLineEnabled: isRegressionEnabled,
    tableData: tableData,
    tooltipHeaderColumn: 0
  };
}
