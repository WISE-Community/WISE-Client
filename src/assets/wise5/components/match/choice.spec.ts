import { NotebookItem } from '../../common/notebook/notebookItem';
import { Choice, createChoiceFromNotebookItem } from './choice';

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
