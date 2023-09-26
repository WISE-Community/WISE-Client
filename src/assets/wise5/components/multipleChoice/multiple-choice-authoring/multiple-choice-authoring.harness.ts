import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';

export class MultipleChoiceAuthoringHarness extends ComponentHarness {
  static hostSelector = 'multiple-choice-authoring';
  protected getAddChoiceButton = this.locatorFor(
    MatButtonHarness.with({ selector: '.add-choice-button' })
  );
  protected getChoices = this.locatorForAll('.choice-container');
  protected getDeleteChoiceButtons = this.locatorForAll(
    MatButtonHarness.with({ selector: '[aria-label="Delete"]' })
  );
  protected getMoveDownButtons = this.locatorForAll(
    MatButtonHarness.with({ selector: '[aria-label="Down"]' })
  );
  protected getMoveUpButtons = this.locatorForAll(
    MatButtonHarness.with({ selector: '[aria-label="Up"]' })
  );
  protected getMultipleAnswerRadioChoice = this.locatorFor(
    MatRadioButtonHarness.with({ label: 'Multiple Answer' })
  );
  protected getSingleAnswerRadioChoice = this.locatorFor(
    MatRadioButtonHarness.with({ label: 'Single Answer' })
  );

  async clickAddChoiceButton(): Promise<void> {
    return (await this.getAddChoiceButton()).click();
  }

  async clickDeleteChoiceButton(index: number): Promise<void> {
    await (await this.getDeleteChoiceButtons())[index].click();
  }

  async clickMoveChoiceDownButton(index: number): Promise<void> {
    await (await this.getMoveDownButtons())[index].click();
  }

  async clickMoveChoiceUpButton(index: number): Promise<void> {
    await (await this.getMoveUpButtons())[index].click();
  }

  async clickMultipleAnswerRadioChoice(): Promise<void> {
    return (await this.getMultipleAnswerRadioChoice()).check();
  }

  async clickSingleAnswerRadioChoice(): Promise<void> {
    return (await this.getSingleAnswerRadioChoice()).check();
  }

  async getNumChoices(): Promise<number> {
    return (await this.getChoices()).length;
  }
}
