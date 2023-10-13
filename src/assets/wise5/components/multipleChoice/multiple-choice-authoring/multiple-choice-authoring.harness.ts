import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';

export class MultipleChoiceAuthoringHarness extends ComponentHarness {
  static hostSelector = 'multiple-choice-authoring';
  getAddChoiceButton = this.locatorFor(MatButtonHarness.with({ selector: '.add-choice-button' }));
  getChoices = this.locatorForAll('.choice-container');
  getDeleteChoiceButtons = this.locatorForAll(
    MatButtonHarness.with({ selector: '[aria-label="Delete"]' })
  );
  getMoveDownButtons = this.locatorForAll(
    MatButtonHarness.with({ selector: '[aria-label="Down"]' })
  );
  getMoveUpButtons = this.locatorForAll(MatButtonHarness.with({ selector: '[aria-label="Up"]' }));
  getMultipleAnswerRadioChoice = this.locatorFor(
    MatRadioButtonHarness.with({ label: 'Multiple Answer' })
  );
  getSingleAnswerRadioChoice = this.locatorFor(
    MatRadioButtonHarness.with({ label: 'Single Answer' })
  );

  async getDeleteChoiceButton(index: number): Promise<MatButtonHarness> {
    return (await this.getDeleteChoiceButtons())[index];
  }

  async getMoveChoiceDownButton(index: number): Promise<MatButtonHarness> {
    return (await this.getMoveDownButtons())[index];
  }

  async getMoveChoiceUpButton(index: number): Promise<MatButtonHarness> {
    return (await this.getMoveUpButtons())[index];
  }

  async getNumChoices(): Promise<number> {
    return (await this.getChoices()).length;
  }
}
