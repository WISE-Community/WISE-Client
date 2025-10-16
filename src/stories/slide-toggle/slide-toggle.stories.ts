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
      defaultValue: false
    },
    disabled: {
      control: 'boolean',
      defaultValue: false
    },
    hideIcon: {
      control: 'boolean',
      defaultValue: false
    },
    labelPosition: {
      control: 'select',
      options: ['before', 'after'],
      defaultValue: 'after',
      type: 'string'
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
