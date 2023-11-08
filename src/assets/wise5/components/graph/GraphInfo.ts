import { ComponentInfo } from '../ComponentInfo';

export class GraphInfo extends ComponentInfo {
  protected description: string = $localize`Students view graph data or add points to a graph.`;
  protected label: string = $localize`Graph`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'Graph',
    prompt:
      'Draw a line that shows the position graph of a person that starts at position 0 meters and then takes 50 seconds to walk 50 meters and then comes back to their start position while moving at a constant speed.',
    showSaveButton: false,
    showSubmitButton: false,
    showAddToNotebookButton: false,
    title: '',
    width: 800,
    height: 500,
    enableTrials: false,
    canCreateNewTrials: false,
    canDeleteTrials: false,
    hideAllTrialsOnNewTrial: false,
    canStudentHideSeriesOnLegendClick: false,
    roundValuesTo: 'integer',
    graphType: 'line',
    xAxis: {
      title: {
        text: 'Time (seconds)',
        useHTML: true
      },
      min: 0,
      max: 100,
      units: 's',
      locked: true,
      type: 'limits',
      allowDecimals: false
    },
    yAxis: {
      title: {
        text: 'Position (meters)',
        useHTML: true,
        style: {
          color: ''
        }
      },
      labels: {
        style: {
          color: ''
        }
      },
      min: 0,
      max: 100,
      units: 'm',
      locked: true,
      allowDecimals: false,
      opposite: false
    },
    series: [
      {
        name: 'Prediction',
        data: [],
        color: 'blue',
        dashStyle: 'Solid',
        marker: {
          symbol: 'circle'
        },
        canEdit: true,
        type: 'line'
      }
    ],
    constraints: []
  };
}
