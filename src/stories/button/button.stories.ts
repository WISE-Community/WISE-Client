import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

type MatButtonStoryType = MatButton & { matButton: string; color?: string };

const meta: Meta<MatButtonStoryType> = {
  title: 'Components/Action/Button',
  component: MatButton,
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule]
    })
  ],
  argTypes: {
    matButton: {
      control: 'select',
      options: ['text', 'filled', 'outlined', 'elevated', 'tonal'],
      description: `'text' | 'filled' | 'outlined', | 'elevated' | 'tonal'`,
      table: { defaultValue: { summary: 'text' } }
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error', 'success'],
      description: `css class: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success'`,
      table: { defaultValue: { summary: 'primary' } }
    }
  },
  args: {
    matButton: '',
    color: ''
  }
};

export default meta;
type Story = StoryObj<MatButtonStoryType>;

export const Default: Story = {
  render: (args) => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton${args.matButton ? '="' + args.matButton + '"' : ''}${args.color ? ' class="' + args.color + '"' : ''}>Button</button>
        <button matButton${args.matButton ? '="' + args.matButton + '"' : ''}${args.color ? ' class="' + args.color + '"' : ''} disabled>Disabled</button>
        <a href="https://wise.berkeley.edu" target="_blank" matButton${args.matButton ? '="' + args.matButton + '"' : ''}${args.color ? ' class="' + args.color + '"' : ''}>Link</a>
      </div>`
  }),
  tags: ['!autodocs', '!dev']
};

export const Text: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton>Button</button>
        <button matButton disabled>Disabled</button>
        <a matButton href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Filled: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton="filled">Button</button>
        <button matButton="filled" disabled>Disabled</button>
        <a matButton="filled" href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Outlined: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton="outlined">Button</button>
        <button matButton="outlined" disabled>Disabled</button>
        <a matButton="outlined" href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Elevated: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton="elevated">Button</button>
        <button matButton="elevated" disabled>Disabled</button>
        <a matButton="elevated" href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Tonal: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matButton="tonal">Button</button>
        <button matButton="tonal" disabled>Disabled</button>
        <a matButton="tonal" href="https://wise.berkeley.edu" target="_blank">Link</a>
      </div>`
  })
};

export const Icon: Story = {
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matIconButton aria-label="Example icon button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button matIconButton aria-label="Example icon button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const FAB: Story = {
  name: 'FAB (Floating Action Button)',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matFab aria-label="Example FAB button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button matFab aria-label="Example FAB button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const miniFAB: Story = {
  name: 'Mini FAB',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matMiniFab aria-label="Example mini FAB button with a plus icon">
          <mat-icon>add</mat-icon>
        </button>
        <button matMiniFab aria-label="Example mini FAB button with a plus icon" disabled>
          <mat-icon>add</mat-icon>
        </button>
      </div>`
  })
};

export const extendedFAB: Story = {
  name: 'Extended FAB',
  render: () => ({
    template: `<div class="flex flex-wrap gap-2">
        <button matFab extended>
          <mat-icon>favorite</mat-icon>
          Favorite
        </button>
        <button matFab extended disabled>
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
          <button matButton>Primary</button>
          <button matButton class="secondary">Secondary</button>
          <button matButton class="tertiary">Tertiary</button>
          <button matButton class="error">Error</button>
          <button matButton class="success">Success</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button matButton="filled">Primary</button>
          <button matButton="filled" class="secondary">Secondary</button>
          <button matButton="filled" class="tertiary">Tertiary</button>
          <button matButton="filled" class="error">Error</button>
          <button matButton="filled" class="success">Success</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button matButton="elevated">Primary</button>
          <button matButton="elevated" class="secondary">Secondary</button>
          <button matButton="elevated" class="tertiary">Tertiary</button>
          <button matButton="elevated" class="error">Error</button>
          <button matButton="elevated" class="success">Success</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button matButton="outlined">Primary</button>
          <button matButton="outlined" class="secondary">Secondary</button>
          <button matButton="outlined" class="tertiary">Tertiary</button>
          <button matButton="outlined" class="error">Error</button>
          <button matButton="outlined" class="success">Success</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button matIconButton aria-label="Example primary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button matIconButton class="secondary" aria-label="Example secondary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button matIconButton class="tertiary" aria-label="Example tertiary icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button matIconButton class="error" aria-label="Example error icon button with a warning icon">
            <mat-icon>warning</mat-icon>
          </button>
          <button matIconButton class="success" aria-label="Example success icon button with a warning icon">
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
        <button matButton>
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button matButton="filled">
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button matButton="outlined">
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button matButton="tonal">
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button matButton="elevated">
          <mat-icon>home</mat-icon>
          Home
        </button>
      </div>`
  })
};
