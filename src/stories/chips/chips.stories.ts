import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ChipsInputComponent } from './chips-input/chips-input.component';

const meta: Meta = {
  title: 'Components/Input/Chips',
  decorators: [
    moduleMetadata({
      imports: [MatChipsModule, MatIconModule, ChipsInputComponent]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Basic = {
  render: () => ({
    template: `
      <mat-chip-list [disabled]="disabled" aria-label="Basic chips" class="flex gap-2">
        <mat-chip>Basic</mat-chip>
        <mat-chip highlighted>Highlighted</mat-chip>
        <mat-chip disabled>Disabled</mat-chip>
      </mat-chip-list>
    `
  }),
  tags: ['!autodocs']
};

export const SingleSelection = {
  render: () => ({
    template: `
      <mat-chip-listbox aria-label="Selection your color">
        <mat-chip-option selected>Blue</mat-chip-option>
        <mat-chip-option>Red</mat-chip-option>
        <mat-chip-option>Green</mat-chip-option>
      </mat-chip-listbox>
    `
  })
};

export const MultipleSelection = {
  render: () => ({
    template: `
      <mat-chip-listbox aria-label="Selection your colors" multiple>
        <mat-chip-option selected>Blue</mat-chip-option>
        <mat-chip-option selected>Red</mat-chip-option>
        <mat-chip-option>Green</mat-chip-option>
        <mat-chip-option>Yellow</mat-chip-option>
      </mat-chip-listbox>
    `
  })
};

export const Avatars = {
  render: () => ({
    template: `
      <mat-chip-list aria-label="Chips with avatars" class="flex gap-2">
        <mat-chip>
          <mat-icon matChipAvatar>face</mat-icon>
          Alice
        </mat-chip>
        <mat-chip>
          <mat-icon matChipAvatar>person</mat-icon>
          Bob
        </mat-chip>
        <mat-chip>
          <mat-icon matChipAvatar>star</mat-icon>
          Carol
        </mat-chip>
      </mat-chip-list>
    `
  })
};

export const WithInputField = {
  render: () => ({
    template: `
      <chips-input />
    `
  })
};
