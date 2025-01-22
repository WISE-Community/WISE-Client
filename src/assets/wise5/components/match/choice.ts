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

/**
 * Merge two arrays of choices.
 * @param {array} choices1 an array of choice objects
 * @param {array} choices2 an array of choice objects
 * @return {array} A new array of unique choice objects
 */
export function mergeChoices(choices1: Choice[], choices2: Choice[]): Choice[] {
  const mergedChoices = choices1.slice();
  const choices1Ids = choices1.map((choice) => choice.id);
  for (const choice2 of choices2) {
    if (!choices1Ids.includes(choice2.id)) {
      mergedChoices.push(choice2);
    }
  }
  return mergedChoices;
}
