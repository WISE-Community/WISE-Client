import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

type MatExpansionPanelStoryType = MatExpansionPanel & { disabled?: boolean; hideToggle?: boolean };

const meta: Meta<MatExpansionPanelStoryType> = {
  title: 'Components/Display/Expansion Panel',
  component: MatExpansionPanel,
  decorators: [
    moduleMetadata({
      imports: [MatExpansionModule, MatIconModule]
    })
  ],
  argTypes: {
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    },
    hideToggle: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } }
    }
  }
};

export default meta;
type Story = StoryObj<MatExpansionPanelStoryType>;

export const Basic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mat-expansion-panel${args.disabled ? ' disabled' : ''}${args.hideToggle ? ' hideToggle' : ''}>
        <mat-expansion-panel-header>
          <mat-panel-title>Expansion panel title</mat-panel-title>
          <mat-panel-description>Description or summary</mat-panel-description>
        </mat-expansion-panel-header>
        <p>This is the primary content of the expansion panel.</p>
      </mat-expansion-panel>
    `
  }),
  args: {
    disabled: false,
    hideToggle: false
  }
};

export const Accordion: Story = {
  render: (args) => ({
    props: {
      ...args
    },
    template: `@let items = ['Item 1', 'Item 2', 'Item 3' ];
      <mat-accordion>
        <mat-expansion-panel *ngFor="let item of items">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ item }}</mat-panel-title>
          </mat-expansion-panel-header>
          <p>This is the primary content of the expansion panel.</p>
        </mat-expansion-panel>
      </mat-accordion>
    `
  })
};

export const AccordionMultiple: Story = {
  render: (args) => ({
    props: args,
    template: `
      <p>Multiple panels can be expanded at the same time.</p>
      <mat-accordion multi>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>Personal information</mat-panel-title>
            <mat-panel-description class="flex justify-between">
              <span>Name and age</span>
              <mat-icon>account_circle</mat-icon>
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>My name is WISE. I am 30 years old.</p>
        </mat-expansion-panel>
        <mat-expansion-panel disabled>
          <mat-expansion-panel-header>
            <mat-panel-title>I am disabled</mat-panel-title>
            <mat-panel-description class="flex justify-end">
              <mat-icon>block</mat-icon>
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p>My name is WISE. I am 30 years old.</p>
        </mat-expansion-panel>
        <mat-expansion-panel (opened)="panelOpenState = true"
                              (closed)="panelOpenState = false">
          <mat-expansion-panel-header>
            <mat-panel-title>Self aware panel</mat-panel-title>
            <mat-panel-description>I am {{panelOpenState ? 'open' : 'closed'}}</mat-panel-description>
          </mat-expansion-panel-header>
          <p>Hello world!</p>
        </mat-expansion-panel>
      </mat-accordion>
    `
  })
};
