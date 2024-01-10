import { ComponentInfo } from '../ComponentInfo';

export class TableInfo extends ComponentInfo {
  protected description: string = $localize`Students view and/or edit table data.`;
  protected label: string = $localize`Table`;
  protected previewExamples: any[] = [
    {
      label: $localize`Table`,
      content: {
        id: 'abcde12345',
        type: 'Table',
        prompt: `<p>Document your findings!</p>
      <p>Run at least 3 trials with the simulation: one with dark sand, one with medium colored sand, and one with light sand. Record the results in the table below.</p>`,
        showSaveButton: false,
        showSubmitButton: false,
        showAddToNotebookButton: false,
        globalCellSize: 9,
        numRows: 4,
        nuColumns: 8,
        tableData: [
          [
            {
              editable: false,
              text: 'Trial'
            },
            {
              editable: false,
              text: 'Sand Color'
            },
            {
              editable: false,
              text: 'Initial number of fish'
            },
            {
              editable: false,
              text: 'Initial number of sharks'
            },
            {
              editable: false,
              text: 'Generations passed'
            },
            {
              editable: false,
              text: 'Resulting number of dark fish'
            },
            {
              editable: false,
              text: 'Resulting number of light fish'
            }
          ],
          [
            {
              editable: false,
              text: '1'
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            }
          ],
          [
            {
              editable: false,
              text: '2'
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            }
          ],
          [
            {
              editable: false,
              text: '3'
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            },
            {
              editable: true,
              text: ''
            }
          ]
        ],
        constraints: []
      }
    }
  ];
}
