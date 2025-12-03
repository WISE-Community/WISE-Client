import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

type MatSlideToggleStoryType = MatSlideToggle;

const meta: Meta<MatSlideToggleStoryType> = {
  title: 'Components/Input/Slide Toggle',
  component: MatSlideToggle,
  decorators: [
    moduleMetadata({
      imports: [MatSlideToggleModule, FormsModule]
    })
  ],
  argTypes: {
    checked: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    },
    hideIcon: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    },
    labelPosition: {
      control: 'select',
      options: ['before', 'after'],
      type: 'string',
      description: `'after' | 'before'`,
      table: { defaultValue: { summary: 'after' } }
    }
  }
};

export default meta;
type Story = StoryObj<MatSlideToggleStoryType>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-slide-toggle${args.checked ? ' checked' : ''}${args.disabled ? ' disabled' : ''}${
        args.hideIcon ? ' hideIcon' : ''
      }${args.labelPosition ? ' labelPosition="' + args.labelPosition + '"' : ''}>
        Slide me!
      </mat-slide-toggle>
    `
  }),
  args: {
    checked: false,
    disabled: false,
    hideIcon: false
  }
};
