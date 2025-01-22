import { NotebookItem } from '../../common/notebook/notebookItem';
import { Choice, createChoiceFromNotebookItem, mergeChoices } from './choice';

const notebookItem = {
  localNotebookItemId: 'note1',
  content: {
    text: 'My Note',
    attachments: []
  }
} as NotebookItem;

describe('Choice', () => {
  describe('createChoiceFromNotebookItem()', () => {
    createChoiceFromNotebookItem_NoAttachment_ReturnTextOnly();
    createChoiceFromNotebookItem_HasAttachment_ReturnTextWithImage();
    test_mergeChoices();
  });
});

function createChoiceFromNotebookItem_NoAttachment_ReturnTextOnly() {
  describe('notebook item does not have attachment', () => {
    it('should create choice with text from notebook', () => {
      notebookItem.content.attachments = [];
      expect(createChoiceFromNotebookItem(notebookItem)).toEqual(new Choice('note1', 'My Note'));
    });
  });
}

function createChoiceFromNotebookItem_HasAttachment_ReturnTextWithImage() {
  describe('notebook item has attachment', () => {
    it('should create choice with text and image from notebook', () => {
      notebookItem.content.attachments.push({ iconURL: 'my-image.png' });
      expect(createChoiceFromNotebookItem(notebookItem)).toEqual(
        new Choice('note1', 'My Note<div><img src="my-image.png" alt="image from note"/></div>')
      );
    });
  });
}

function test_mergeChoices() {
  describe('mergeChoices', () => {
    const choice1 = { id: 'choice1', type: 'choice', value: 'Choice A' };
    const choice2 = { id: 'choice2', type: 'choice', value: 'Choice B' };
    const choice3 = { id: 'choice3', type: 'choice', value: 'Choice C' };
    it('should merge choices', () => {
      const choices1 = [choice1, choice2];
      const choices2 = [choice2, choice3];
      const mergedChoices = mergeChoices(choices1, choices2);
      expect(mergedChoices.length).toEqual(3);
      expect(mergedChoices[0].id).toEqual('choice1');
      expect(mergedChoices[1].id).toEqual('choice2');
      expect(mergedChoices[2].id).toEqual('choice3');
    });
  });
}
