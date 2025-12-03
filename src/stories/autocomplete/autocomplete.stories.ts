import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { AutocompleteFilterComponent } from './autocomplete-filter/autocomplete-filter.component';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';

const meta: Meta = {
  title: 'Components/Input/Autcomplete',
  decorators: [
    moduleMetadata({
      imports: [AutocompleteFilterComponent, ChipsAutocompleteComponent]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Single Selection',
  render: (args) => ({
    template: `<autocomplete-filter />`
  })
};

export const ChipsAutocomplete: Story = {
  name: 'Multiple Selection',
  render: (args) => ({
    template: `<chips-autocomplete />`
  })
};
