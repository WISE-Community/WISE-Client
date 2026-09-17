import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

type MatProgressSpinnerStoryType = MatProgressSpinner & {
  value?: number;
  diameter?: number;
};

const meta: Meta<MatProgressSpinnerStoryType> = {
  title: 'Components/Feedback/Progress Spinner',
  component: MatProgressSpinner,
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule]
    })
  ],
  argTypes: {
    mode: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: `'determinate' | 'indeterminate'`,
      table: { defaultValue: { summary: 'determinate' } }
    },
    value: {
      control: 'number',
      description: 'Value of the progress spinner. Only used in determinate mode.'
    },
    diameter: {
      control: 'number',
      description: 'The diameter of the progress spinner (in pixels).'
    }
  }
};

export default meta;
type Story = StoryObj<MatProgressSpinnerStoryType>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-progress-spinner
        mode="${args.mode}"
        value="${args.value}"
        ${args.diameter ? `diameter="${args.diameter}"` : ''}>
      </mat-progress-spinner>
    `
  }),
  args: {
    mode: 'determinate',
    value: 50,
    diameter: 36
  },
  tags: ['!autodocs', '!dev']
};

export const Determinate: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-spinner mode="determinate" value="50" diameter="36"></mat-progress-spinner>`
  })
};

export const Indeterminate: Story = {
  render: (args) => ({
    props: args,
    template: `<mat-progress-spinner mode="indeterminate" diameter="36"></mat-progress-spinner>`
  })
};

export const Diameter: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="flex items-center gap-8">
        <mat-progress-spinner mode="determinate" diameter="24" value="50"></mat-progress-spinner>
        <mat-progress-spinner mode="determinate" diameter="36" value="50"></mat-progress-spinner>
        <mat-progress-spinner mode="determinate" diameter="48" value="50"></mat-progress-spinner>
        <mat-progress-spinner mode="determinate" diameter="60" value="50"></mat-progress-spinner>
      </div>`
  })
};

export const ButtonProgress: Story = {
  render: (args) => ({
    props: args,
    template: `<div class="flex gap-2">
        <button matButton="filled" disabled>
          <div class="flex items-center gap-2">
            <span>Submit</span>
            <mat-progress-spinner mode="indeterminate" diameter="20"></mat-progress-spinner>
          </div>
        </button>
        <button matButton="outlined" disabled>
          <div class="flex items-center gap-2">
            <span>Submit</span>
            <mat-progress-spinner mode="indeterminate" diameter="20"></mat-progress-spinner>
          </div>
        </button>
      </div>`
  })
};
