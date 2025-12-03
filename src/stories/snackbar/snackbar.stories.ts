import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SnackbarTriggerComponent } from './snackbar-trigger/snackbar-trigger.component';

const meta: Meta<SnackbarTriggerComponent> = {
  title: 'Components/Feedback/Snackbar',
  component: SnackbarTriggerComponent,
  decorators: [
    moduleMetadata({
      imports: [SnackbarTriggerComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<SnackbarTriggerComponent>;

export const Default: Story = {
  render: () => ({
    template: `<snackbar-trigger />`
  }),
  tags: ['!autodocs', '!dev']
};
