import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { AutocompleteFilterComponent } from './autocomplete-filter/autocomplete-filter.component';

type AutocompleteStoryType = AutocompleteFilterComponent;

const meta: Meta<AutocompleteStoryType> = {
  title: 'Components/Input/Autocomplete',
  component: AutocompleteFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [AutocompleteFilterComponent]
    })
  ],
  argTypes: {}
};

export default meta;
type Story = StoryObj<AutocompleteStoryType>;

export const Default: Story = {
  render: (args) => ({
    template: `<autocomplete-filter />`
  }),
  tags: ['!autodocs', '!dev']
};
