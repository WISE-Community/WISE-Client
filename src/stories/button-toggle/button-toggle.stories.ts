import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';

type MatButtonToggleGroupStoryType = MatButtonToggleGroup & {
  multiple: boolean;
  hideSingleSelectionIndicator: boolean;
  hideMultipleSelectionIndicator: boolean;
};

const meta: Meta<MatButtonToggleGroupStoryType> = {
  title: 'Components/Action/Button Toggle',
  component: MatButtonToggleGroup,
  decorators: [
    moduleMetadata({
      imports: [MatButtonToggleModule]
    })
  ],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Whether multiple button toggles can be selected.',
      table: { defaultValue: { summary: 'false' } }
    },
    hideSingleSelectionIndicator: {
      control: 'boolean',
      description: 'Whether the single selection indicator checkmark is hidden.',
      table: { defaultValue: { summary: 'false' } }
    },
    hideMultipleSelectionIndicator: {
      control: 'boolean',
      description: 'Whether the multiple selection indicator checkmark is hidden.',
      table: { defaultValue: { summary: 'false' } }
    }
  },
  args: {
    multiple: false,
    hideSingleSelectionIndicator: false,
    hideMultipleSelectionIndicator: false
  }
};

export default meta;
type Story = StoryObj<MatButtonToggleGroupStoryType>;

export const Default: Story = {
  render: (args) => ({
    template: `
      <mat-button-toggle-group aria-label="Size"${args.multiple ? ' multiple' : ''}${args.hideSingleSelectionIndicator ? ' hideSingleSelectionIndicator' : ''}${args.hideMultipleSelectionIndicator ? ' hideMultipleSelectionIndicator' : ''}>
        <mat-button-toggle value="small">Small</mat-button-toggle>
        <mat-button-toggle value="medium">Medium</mat-button-toggle>
        <mat-button-toggle value="large">Large</mat-button-toggle>
      </mat-button-toggle-group>
    `
  }),
  tags: ['!dev']
};

export const SingleSelection: Story = {
  render: () => ({
    template: `
      <mat-button-toggle-group aria-label="Size">
        <mat-button-toggle value="small">Small</mat-button-toggle>
        <mat-button-toggle value="medium">Medium</mat-button-toggle>
        <mat-button-toggle value="large">Large</mat-button-toggle>
      </mat-button-toggle-group>
    `
  })
};

export const MultipleSelection: Story = {
  render: () => ({
    template: `
      <mat-button-toggle-group multiple aria-label="Size">
        <mat-button-toggle value="small">Small</mat-button-toggle>
        <mat-button-toggle value="medium">Medium</mat-button-toggle>
        <mat-button-toggle value="large">Large</mat-button-toggle>
      </mat-button-toggle-group>
    `
  })
};

export const HideSelectionIndicators: Story = {
  render: () => ({
    template: `
      <p>
        <mat-button-toggle-group hideSingleSelectionIndicator aria-label="Size">
          <mat-button-toggle value="small">Small</mat-button-toggle>
          <mat-button-toggle value="medium">Medium</mat-button-toggle>
          <mat-button-toggle value="large">Large</mat-button-toggle>
        </mat-button-toggle-group>
      </p>
      <p>
        <mat-button-toggle-group multiple hideMultipleSelectionIndicator aria-label="Size">
          <mat-button-toggle value="small">Small</mat-button-toggle>
          <mat-button-toggle value="medium">Medium</mat-button-toggle>
          <mat-button-toggle value="large">Large</mat-button-toggle>
        </mat-button-toggle-group>
      </p>
    `
  })
};
