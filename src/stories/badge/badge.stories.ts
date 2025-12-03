import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type BadgeStoryArgs = {
  matBadge?: string | number | null;
  matBadgeDescription?: string;
  matBadgeHidden?: boolean;
  matBadgeOverlap?: boolean;
  matBadgePosition?: 'above before' | 'above after' | 'below before' | 'below after';
  matBadgeSize?: 'small' | 'medium' | 'large';
};

const meta: Meta<BadgeStoryArgs> = {
  title: 'Components/Display/Badge',
  decorators: [moduleMetadata({ imports: [MatBadgeModule, MatIconModule, MatButtonModule] })],
  argTypes: {
    matBadge: { control: 'text' },
    matBadgeDescription: { control: 'text' },
    matBadgeHidden: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    matBadgeOverlap: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    matBadgePosition: {
      control: 'select',
      options: ['above before', 'above after', 'below before', 'below after'],
      description: `'above before' | 'above after' | 'below before' | 'below after'`,
      table: { defaultValue: { summary: 'above after' } }
    },
    matBadgeSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: `'small' | 'medium' | 'large'`,
      table: { defaultValue: { summary: 'medium' } }
    }
  },
  args: {
    matBadge: '4',
    matBadgeDescription: 'This is a badge',
    matBadgeHidden: false,
    matBadgeOverlap: true,
    matBadgePosition: 'above after',
    matBadgeSize: 'medium'
  }
};

export default meta;
type Story = StoryObj<BadgeStoryArgs>;

export const Basic: Story = {
  render: (args) => ({
    template: `
      <div class="flex flex-wrap gap-4 items-center">
        <button
            matButton="filled"
            matBadge="${args.matBadge}"
            matBadgePosition="${args.matBadgePosition}"
            matBadgeOverlap="${args.matBadgeOverlap}"
            matBadgeHidden="${args.matBadgeHidden}"
            matBadgeSize="${args.matBadgeSize}"
            matBadgeDescription="${args.matBadgeDescription}">
          <mat-icon>inbox</mat-icon> Inbox
        </button>
        <button
            matIconButton
            aria-label="Notifications"
            matBadge="${args.matBadge}"
            matBadgePosition="${args.matBadgePosition}"
            matBadgeOverlap="${args.matBadgeOverlap}"
            matBadgeHidden="${args.matBadgeHidden}"
            matBadgeSize="${args.matBadgeSize}"
            matBadgeDescription="${args.matBadgeDescription}">
          <mat-icon>notifications</mat-icon>
        </button>
      </div>
    `,
    props: { ...args }
  }),
  tags: ['!autodocs']
};

export const Position: Story = {
  render: () => ({
    template: `
      <div class="flex gap-8 items-center">
        <button matIconButton matBadge="2" matBadgePosition="above after" matBadgeDescription="2 new messages" aria-label="mail">
          <mat-icon>mail</mat-icon>
        </button>
        
        <button matIconButton matBadge="4" matBadgePosition="below after" matBadgeDescription="4 new messages" aria-label="mail">
          <mat-icon>mail</mat-icon>
        </button>
        <button matIconButton matBadge="1" matBadgePosition="above before" matBadgeDescription="1 new message" aria-label="mail">
          <mat-icon>mail</mat-icon>
        </button>
        <button matIconButton matBadge="3" matBadgePosition="below before" matBadgeDescription="3 new messages" aria-label="mail">
          <mat-icon>mail</mat-icon>
        </button>
      </div>
    `
  })
};

export const Overlap: Story = {
  render: () => ({
    template: `
      <div class="flex gap-8 items-center">
        <button matButton="filled" matBadge="1" matBadgeOverlap="true" matBadgeDescription="1 new message">
          <mat-icon>notifications</mat-icon> Inbox
        </button>
        <button matButton="filled" matBadge="2" matBadgeOverlap="false" matBadgeDescription="2 new messages">
          <mat-icon>notifications</mat-icon> Inbox
        </button>
      </div>
    `
  })
};

export const Hidden: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4 items-center">
        <button matIconButton matBadge="1" matBadgeHidden="true" matBadgeDescription="1 new message" aria-label="chat">
          <mat-icon>chat</mat-icon>
        </button>
        <button matIconButton matBadge="2" matBadgeHidden="false" matBadgeDescription="2 new messages" aria-label="chat">
          <mat-icon>chat</mat-icon>
        </button>
      </div>
    `
  })
};

export const Size: Story = {
  render: (args) => ({
    template: `
      <div class="flex gap-4 items-center">
        <button matIconButton matBadge="1" matBadgeSize="small" matBadgeDescription="1 notification" aria-label="notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button matIconButton matBadge="2" matBadgeSize="medium" matBadgeDescription="2 notifications" aria-label="notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button matIconButton matBadge="3" matBadgeSize="large" matBadgeDescription="3 notifications" aria-label="notificiations">
          <mat-icon>notifications</mat-icon>
        </button>
      </div>
    `
  })
};
