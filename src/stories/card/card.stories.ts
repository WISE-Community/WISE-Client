import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

type CardStoryArgs = {
  appearance?: 'outlined' | 'raised' | 'filled';
  title?: string;
};

const meta: Meta<CardStoryArgs> = {
  title: 'Components/Display/Card',
  decorators: [
    moduleMetadata({
      imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule]
    })
  ],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['outlined', 'raised', 'filled'],
      description: `'outlined' | 'raised' | 'filled'`,
      table: { defaultValue: { summary: 'raised' } }
    },
    title: { control: 'text', table: { disable: true } }
  },
  args: {
    appearance: 'raised',
    title: 'Card Title'
  }
};

export default meta;
type Story = StoryObj<CardStoryArgs>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-card appearance="${args.appearance}" class="max-w-96">
        <mat-card-header>
          <div mat-card-avatar style="
            background-image: url('./picsum-flower-400x200.jpg');
            background-size: cover;">
          </div>
          <mat-card-title>${args.title}</mat-card-title>
          <mat-card-subtitle>Card Subtitle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>This is the content of the card. It can be whatever you like.</p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button>More</button>
          <button mat-button>Close</button>
        </mat-card-actions>
      </mat-card>
    `
  }),
  tags: ['!autodocs', '!dev']
};

export const Filled: Story = {
  ...Default,
  args: {
    appearance: 'filled',
    title: 'Filled Card'
  }
};

export const Outlined: Story = {
  ...Default,
  args: {
    appearance: 'outlined',
    title: 'Outlined Card'
  }
};

export const Raised: Story = {
  ...Default,
  args: {
    appearance: 'raised',
    title: 'Raised Card'
  }
};

export const ActionAlignment: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-wrap gap-4">
        <mat-card class="max-w-72">
          <mat-card-header>
            <mat-card-title>Align to Start</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Actions are aligned to the start of the container.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>More</button>
            <button mat-button>Close</button>
          </mat-card-actions>
        </mat-card>
        <mat-card class="max-w-72">
          <mat-card-header>
            <mat-card-title>Align to End</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Actions are aligned to the end of the container.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button>More</button>
            <button mat-button>Close</button>
          </mat-card-actions>
        </mat-card>
      </div>
    `
  })
};

export const WithMedia: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-card class="max-w-96">
        <mat-card-header>
          <div mat-card-avatar style="
            background-image: url('./picsum-flower-400x200.jpg');
            background-size: cover;">
          </div>
          <mat-card-title>{{ title }}</mat-card-title>
        </mat-card-header>
        <img mat-card-image src="./picsum-road-400x200.jpg" alt="Road and mountain scene">
        <mat-card-content>
          <p class="pt-4">
            This is a card with a media image. The content can be whatever you like.
          </p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button>More</button>
          <button mat-button>Close</button>
        </mat-card-actions>
      </mat-card>
    `
  })
};

export const WithFooter: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-card class="max-w-96">
        <img mat-card-image src="./picsum-road-400x200.jpg" alt="Road and mountain scene">
        <mat-card-content>
          <p class="pt-4">
            This is a card with a footer. The content can be whatever you like.
          </p>
        </mat-card-content>
        <mat-card-footer class="p-4 pt-2">
          <mat-chip-set aria-label="Tags" class="flex gap-2">
            <mat-chip>Blue</mat-chip>
            <mat-chip>Red</mat-chip>
            <mat-chip>Green</mat-chip>
            <mat-chip>Yellow</mat-chip>
          </mat-chip-set>
        </mat-card-footer>
      </mat-card>
    `
  })
};
