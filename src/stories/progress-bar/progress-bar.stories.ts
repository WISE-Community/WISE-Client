import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

type MatProgressBarStoryType = MatProgressBar & { value?: number; bufferValue: number };

const meta: Meta<MatProgressBarStoryType> = {
  title: 'Components/Feedback/Progress Bar',
  component: MatProgressBar,
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatProgressBarModule, MatRadioModule, FormsModule, MatCardModule]
    })
  ],
  argTypes: {
    mode: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      description: `'determinate' | 'indeterminate' | 'buffer' | 'query'`,
      table: { defaultValue: { summary: 'determinate' } }
    },
    value: {
      control: 'number'
    },
    bufferValue: {
      control: 'number'
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
        mode="${args.mode}"
        value="${args.value}"
        bufferValue="${args.bufferValue}">
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

export const ButtonProgress: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="flex gap-2">
        <button matButton="filled" disabled>
          Submit
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </button>
        <button matButton="outlined" disabled>
          Submit
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </button>
      </div>`
  })
};
