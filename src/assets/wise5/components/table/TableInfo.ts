import { ComponentInfo } from '../ComponentInfo';

export class TableInfo extends ComponentInfo {
  description: string = $localize`The student views a table that they may or may not be able to change.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'Table',
    prompt: 'Add the number of elephants to the graph.',
    showSaveButton: false,
    showSubmitButton: false,
    globalCellSize: 10,
    numRows: 5,
    numColumns: 2,
    tableData: [
      [
        {
          text: 'Animal',
          editable: false,
          size: null
        },
        {
          text: 'Count',
          editable: false,
          size: null
        }
      ],
      [
        {
          text: 'Bears',
          editable: false,
          size: null
        },
        {
          text: '1',
          editable: false,
          size: null
        }
      ],
      [
        {
          text: 'Cats',
          editable: false,
          size: null
        },
        {
          text: '4',
          editable: false,
          size: null
        }
      ],
      [
        {
          text: 'Dogs',
          editable: false,
          size: null
        },
        {
          text: '6',
          editable: false,
          size: null
        }
      ],
      [
        {
          text: 'Elephants',
          editable: false,
          size: null
        },
        {
          text: '',
          editable: true,
          size: null
        }
      ]
    ],
    constraints: []
  };
}
