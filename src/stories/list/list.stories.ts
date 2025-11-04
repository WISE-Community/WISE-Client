import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

const meta: Meta = {
  title: 'Components/Display/List',
  decorators: [
    moduleMetadata({
      imports: [MatListModule, MatIconModule]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <mat-list role="list">
        <mat-list-item role="listitem">Item 1</mat-list-item>
        <mat-list-item role="listitem">Item 2</mat-list-item>
        <mat-list-item role="listitem">Item 3</mat-list-item>
      </mat-list>
    `
  })
};

export const Action: Story = {
  render: () => ({
    template: `
      <div class="shadow-md rounded-md px-2 w-72">
        <mat-action-list aria-label="Actions">
          <button mat-list-item>
            <mat-icon matListItemIcon>content_cut</mat-icon>
            <span>Cut</span>
          </button>
          <button mat-list-item>
            <mat-icon matListItemIcon>content_copy</mat-icon>
            <span>Copy</span>
          </button>
          <button mat-list-item disabled>
            <mat-icon matListItemIcon>content_paste</mat-icon>
            <span>Paste</span>
          </button>
          <button mat-list-item>
            <mat-icon matListItemIcon>save</mat-icon>
            <span>Save</span>
          </button>
        </mat-action-list>
      </div>
    `
  })
};

export const Navigation: Story = {
  render: () => ({
    template: `
      <div class="shadow-md rounded-md px-2 w-72">
        <mat-nav-list aria-label="Menu links">
          <a mat-list-item href="#" (click)="$event.preventDefault()" activated>
            <mat-icon matListItemIcon>home</mat-icon>
            <span>Home</span>
          </a>
          <a mat-list-item href="#" (click)="$event.preventDefault()">
            <mat-icon matListItemIcon>person</mat-icon>
            <span>Profile</span>
          </a>
          <a mat-list-item href="#" (click)="$event.preventDefault()">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span>Settings</span>
          </a>
        </mat-nav-list>
      </div>
    `
  })
};

export const SingleSelection: Story = {
  render: () => ({
    template: `

      <mat-selection-list #colors [multiple]="false">
        @for (color of ['Blue', 'Red', 'Green', 'Yellow']; track color) {
          <mat-list-option [value]="color">{{color}}</mat-list-option>
        }
      </mat-selection-list>
      <p class="font-medium">
        Option selected: {{colors.selectedOptions.hasValue() ? colors.selectedOptions.selected[0].value : 'None'}}
      </p>
    `
  })
};

export const MultipleSelection: Story = {
  render: () => ({
    template: `
      <mat-selection-list #colors>
        @for (color of ['Blue', 'Red', 'Green', 'Yellow']; track color) {
          <mat-list-option [value]="color">{{color}}</mat-list-option>
        }
      </mat-selection-list>
      <p class="font-medium">
        Options selected: {{colors.selectedOptions.selected.length}}
      </p>
    `
  })
};
