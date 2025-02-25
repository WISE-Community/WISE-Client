import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

type MatButtonStoryType = MatButton & { variant?: string; color?: string };

const meta: Meta<MatButtonStoryType> = {
  title: 'Components/Actions/Button',
  component: MatButton,
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule]
    })
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['', 'text', 'flat', 'stroked', 'raised']
    },
    color: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'tertiary', 'error']
    }
  },
  args: {
    variant: '',
    color: ''
  }
};

export default meta;
type Story = StoryObj<MatButtonStoryType>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-${!args.variant || args.variant === 'text' ? '' : args.variant + '-'}button ${args.color ? 'class="' + args.color + '" ' : ''}>Button</button>
        <button mat-${!args.variant || args.variant === 'text' ? '' : args.variant + '-'}button ${args.color ? 'class="' + args.color + '" ' : ''}disabled>Disabled</button>
        <a href="https://wise.berkeley.edu" target="_blank" mat-${!args.variant || args.variant === 'text' ? '' : args.variant + '-'}button ${args.color ? 'class="' + args.color + '" ' : ''}>Link</a>
      </div>`
  }),
  tags: ['!autodocs', '!dev']
};

export const Text: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-button>Button</button>
        <button mat-button disabled>Disabled</button>
        <a mat-button href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Flat: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-flat-button>Button</button>
        <button mat-flat-button disabled>Disabled</button>
        <a mat-flat-button href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Stroked: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-stroked-button>Button</button>
        <button mat-stroked-button disabled>Disabled</button>
        <a mat-stroked-button href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Raised: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-raised-button>Button</button>
        <button mat-raised-button disabled>Disabled</button>
        <a mat-raised-button href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Icon: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-icon-button aria-label="Example icon button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-icon-button aria-label="Example icon button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const FAB: Story = {
  name: 'FAB (Floating Action Button)',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-fab aria-label="Example FAB button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-fab aria-label="Example FAB button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const miniFAB: Story = {
  name: 'Mini FAB',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-mini-fab aria-label="Example mini FAB button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-mini-fab aria-label="Example mini FAB button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const extendedFAB: Story = {
  name: 'Extended FAB',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-fab extended>
          <mat-icon>favorite</mat-icon>
          Favorite
        </button>
        <button mat-fab extended disabled>
          <mat-icon>favorite</mat-icon>
          Disabled
        </button>
      </div>`
  })
};

export const Colors: Story = {
  render: () => ({
    template: `<div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2">
          <button mat-button class="primary">Primary</button>
          <button mat-button class="secondary">Secondary</button>
          <button mat-button class="tertiary">Tertiary</button>
          <button mat-button class="error">Error</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button mat-flat-button class="primary">Primary</button>
          <button mat-flat-button class="secondary">Secondary</button>
          <button mat-flat-button class="tertiary">Tertiary</button>
          <button mat-flat-button class="error">Error</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button mat-stroked-button class="primary">Primary</button>
          <button mat-stroked-button class="secondary">Secondary</button>
          <button mat-stroked-button class="tertiary">Tertiary</button>
          <button mat-stroked-button class="error">Error</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button mat-raised-button class="primary">Primary</button>
          <button mat-raised-button class="secondary">Secondary</button>
          <button mat-raised-button class="tertiary">Tertiary</button>
          <button mat-raised-button class="error">Error</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button mat-icon-button class="primary" aria-label="Example primary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button mat-icon-button class="secondary" aria-label="Example secondary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button mat-icon-button class="tertiary" aria-label="Example tertiary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button mat-icon-button class="error" aria-label="Example error icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
        </div>
      </div>`
  })
};

export const withIcon: Story = {
  name: 'With Icon',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button mat-button>
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button mat-flat-button>
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button mat-stroked-button>
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button mat-raised-button>
          <mat-icon>home</mat-icon>
          Home
        </button>
      </div>`
  })
};
