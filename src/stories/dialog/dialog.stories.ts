import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { DialogOverviewComponent } from './dialog-overview/dialog-overview.component';

const meta: Meta<DialogOverviewComponent> = {
  title: 'Components/Action/Dialog',
  component: DialogOverviewComponent,
  decorators: [
    moduleMetadata({
      imports: [DialogOverviewComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<DialogOverviewComponent>;

export const Default: Story = {
  render: () => ({
    template: `<dialog-overview />`
  }),
  tags: ['!autodocs', '!dev']
};
