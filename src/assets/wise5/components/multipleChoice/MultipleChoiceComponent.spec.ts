import { MultipleChoiceComponent } from './MultipleChoiceComponent';
import { MultipleChoiceContent } from './MultipleChoiceContent';

let component: MultipleChoiceComponent;
const choice1 = { id: 'choice1', text: 'Choice 1', isCorrect: true };
const choice2 = { id: 'choice2', text: 'Choice 2', isCorrect: true };
const choice3 = { id: 'choice3', text: 'Choice 3', isCorrect: true };

describe('MultipleChoiceComponent', () => {
  calculateIsCorrect();
});

function calculateIsCorrect() {
  describe('calculateIsCorrect()', () => {
    calculateIsCorrect_radio();
    calculateIsCorrect_radio_checkbox();
  });
}

function calculateIsCorrect_radio() {
  describe('radio', () => {
    beforeEach(() => {
      component = new MultipleChoiceComponent(
        {
          choiceType: 'radio',
          choices: [choice1]
        } as MultipleChoiceContent,
        'node1'
      );
    });
    it('return false when student chose the wrong choice', () => {
      expectIsCorrect([choice2], false);
    });
    it('return true when student chose the right choice', () => {
      expectIsCorrect([choice1], true);
    });
  });
}

function calculateIsCorrect_radio_checkbox() {
  describe('checkbox', () => {
    beforeEach(() => {
      component = new MultipleChoiceComponent(
        {
          choiceType: 'checkbox',
          choices: [choice1, choice2]
        } as MultipleChoiceContent,
        'node1'
      );
    });
    it('return false when student chose the wrong choices', () => {
      expectIsCorrect([choice1, choice2, choice3], false);
    });
    it('return true when student chose the right choices', () => {
      expectIsCorrect([choice1, choice2], true);
    });
  });
}

function expectIsCorrect(chosenChoices: any[], expectedResult: boolean): void {
  const componentState = { studentData: { studentChoices: chosenChoices } };
  expect(component.calculateIsCorrect(componentState)).toBe(expectedResult);
}
