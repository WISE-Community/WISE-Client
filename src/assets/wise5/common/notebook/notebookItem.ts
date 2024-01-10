export class NotebookItem {
  content: {
    text: string;
    attachments: any[];
  };
  localNotebookItemId: string;
  serverDeleteTime: number;
  type: 'note' | 'report';
}
