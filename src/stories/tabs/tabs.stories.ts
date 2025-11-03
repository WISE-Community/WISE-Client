import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

type TabStoryArgs = {
  'mat-align-tabs'?: 'start' | 'center' | 'end';
  'mat-stretch-tabs'?: boolean;
  headerPosition?: 'above' | 'below';
};

const meta: Meta<TabStoryArgs> = {
  title: 'Components/Action/Tabs',
  component: MatTabGroup,
  decorators: [
    moduleMetadata({
      imports: [MatTabsModule, MatIconModule]
    })
  ],
  argTypes: {
    'mat-align-tabs': {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: `'start' | 'center' | 'end'`,
      type: 'string',
      table: { defaultValue: { summary: 'start' } }
    },
    'mat-stretch-tabs': {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    },
    headerPosition: {
      control: 'select',
      options: ['above', 'below'],
      description: `'above' | 'below'`,
      type: 'string',
      table: { defaultValue: { summary: 'above' } }
    }
  },
  args: {
    'mat-align-tabs': null,
    'mat-stretch-tabs': false,
    headerPosition: null
  }
};

export default meta;
type Story = StoryObj<TabStoryArgs>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-tab-group${
        args['mat-align-tabs'] ? ' mat-align-tabs="' + args['mat-align-tabs'] + '"' : ''
      }${
        args['mat-stretch-tabs'] ? ' mat-stretch-tabs="' + args['mat-stretch-tabs'] + '"' : ''
      }${args.headerPosition ? ' headerPosition="' + args.headerPosition + '"' : ''}>
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
    `
  })
};

export const LabelAlignment: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-tab-group mat-align-tabs="start">
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
      <mat-tab-group mat-align-tabs="center">
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
      <mat-tab-group mat-align-tabs="end">
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
    `
  })
};

export const ComplexLabels: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-tab-group>
        <mat-tab>
            <ng-template mat-tab-label>
              <div class="flex gap-2 items-center">
                <mat-icon>looks_one</mat-icon>
                First
              </div>
            </ng-template>
            <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab>
            <ng-template mat-tab-label>
                <div class="flex gap-2 items-center">
                  <mat-icon>looks_two</mat-icon>
                  Second
                </div>
            </ng-template>
            <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab>
            <ng-template mat-tab-label>
              <div class="flex gap-2 items-center">
                <mat-icon>looks_3</mat-icon>
                Third
              </div>
            </ng-template>
            <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
    `
  })
};

export const StretchTabs: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-tab-group mat-stretch-tabs>
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
    `
  })
};

export const HeaderBelowContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-tab-group headerPosition="below">
        <mat-tab label="First">
          <div class="p-4">Content for tab 1</div>
        </mat-tab>
        <mat-tab label="Second">
          <div class="p-4">Content for tab 2</div>
        </mat-tab>
        <mat-tab label="Third">
          <div class="p-4">Content for tab 3</div>
        </mat-tab>
      </mat-tab-group>
    `
  })
};
