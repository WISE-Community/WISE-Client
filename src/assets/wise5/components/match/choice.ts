import { NotebookItem } from '../../common/notebook/notebookItem';

export class Choice {
  feedback?: string;
  id: string;
  isCorrect?: boolean;
  isIncorrectPosition?: boolean;
  studentCreated?: boolean;
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

export function createChoiceFromNotebookItem(notebookItem: NotebookItem): Choice {
  let value = notebookItem.content.text;
  notebookItem.content.attachments.forEach((attachment) => {
    value += `<div><img src="${attachment.iconURL}" alt="image from note"/></div>`;
  });
  return new Choice(notebookItem.localNotebookItemId, value);
}
