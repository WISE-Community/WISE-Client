import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

type MatProgressBarStoryType = MatProgressBar & { value?: number; bufferValue: number };

const meta: Meta<MatProgressBarStoryType> = {
  title: 'Components/Display/Progress Bar',
  component: MatProgressBar,
  decorators: [
    moduleMetadata({
      imports: [MatProgressBarModule, MatRadioModule, FormsModule, MatCardModule]
    })
  ],
  argTypes: {
    mode: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      defaultValue: 'determinate'
    },
    value: {
      control: 'number',
      defaultValue: 30
    },
    bufferValue: {
      control: 'number',
      defaultValue: 60
    }
  }
};

export default meta;
type Story = StoryObj<MatProgressBarStoryType>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-progress-bar
        [mode]="mode"
        [value]="value"
        [bufferValue]="bufferValue">
      </mat-progress-bar>
    `
  }),
  args: {
    mode: 'determinate',
    value: 30,
    bufferValue: 60
  },
  tags: ['!autodocs', '!dev']
};

export const Determinate: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-bar mode="determinate" value="40"></mat-progress-bar>`
  })
};

export const Indeterminate: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-bar mode="indeterminate"></mat-progress-bar>`
  })
};

export const Buffer: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-bar mode="buffer" value="4" bufferValue="20"></mat-progress-bar>`
  })
};

export const Query: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-bar mode="query"></mat-progress-bar>`
  })
};
