import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';

type DialogStoryType = DialogOverviewComponent;

const meta: Meta<DialogStoryType> = {
  title: 'Components/Action/Dialog',
  component: DialogOverviewComponent,
  decorators: [
    moduleMetadata({
      imports: [DialogOverviewComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<DialogStoryType>;

export const Default: Story = {
  render: (args) => ({
    template: `<dialog-overview />`
  }),
  tags: ['!autodocs', '!dev']
};
