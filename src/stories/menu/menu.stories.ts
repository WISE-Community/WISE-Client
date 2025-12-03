import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';

type MatMenuStoryType = MatMenu;

const meta: Meta<MatMenuStoryType> = {
  title: 'Components/Action/Menu',
  component: MatMenu,
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule, MatMenuModule]
    })
  ]
};

export default meta;
type Story = StoryObj<MatMenuStoryType>;

export const Basic: Story = {
  render: (args) => ({
    template: `<button matButton [matMenuTriggerFor]="menu">Open Menu</button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item>Item 1</button>
        <button mat-menu-item>Item 2</button>
      </mat-menu>
`
  }),
  tags: ['!autodocs']
};

export const Icons: Story = {
  render: (args) => ({
    template: `<button matIconButton [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item>
          <mat-icon>content_cut</mat-icon>
          <span>Cut</span>
        </button>
        <button mat-menu-item>
          <mat-icon>content_copy</mat-icon>
          <span>Copy</span>
        </button>
        <button mat-menu-item disabled>
          <mat-icon>content_paste</mat-icon>
          <span>Paste</span>
        </button>
        <button mat-menu-item>
          <mat-icon>save</mat-icon>
          <span>Save</span>
        </button>
      </mat-menu>`
  })
};

export const Nested: Story = {
  render: (args) => ({
    template: `<button matButton [matMenuTriggerFor]="colors">Colors</button>
      <mat-menu #colors="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="primary">Primary</button>
        <button mat-menu-item [matMenuTriggerFor]="secondary">Secondary</button>
        <button mat-menu-item [matMenuTriggerFor]="tertiary">Tertiary</button>
        <button mat-menu-item [matMenuTriggerFor]="other">Other</button>
      </mat-menu>
      <mat-menu #primary="matMenu">
        <button mat-menu-item>Red</button>
        <button mat-menu-item>Blue</button>
        <button mat-menu-item>Yellow</button>
      </mat-menu>
      <mat-menu #secondary="matMenu">
        <button mat-menu-item>Orange</button>
        <button mat-menu-item>Green</button>
        <button mat-menu-item>Purple</button>
      </mat-menu>
      <mat-menu #tertiary="matMenu">
        <button mat-menu-item>Red-Orange</button>
        <button mat-menu-item>Yellow-Orange</button>
        <button mat-menu-item>Yellow-Green</button>
        <button mat-menu-item>Blue-Green</button>
        <button mat-menu-item>Blue-Purple</button>
        <button mat-menu-item>Red-Purple</button>
      </mat-menu>
      <mat-menu #other="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="grayscale">Grayscale</button>
        <button mat-menu-item [matMenuTriggerFor]="common">Common</button>
      </mat-menu>
      <mat-menu #grayscale="matMenu">
        <button mat-menu-item>Black</button>
        <button mat-menu-item>White</button>
        <button mat-menu-item>Gray</button>
      </mat-menu>
      <mat-menu #common="matMenu">
        <button mat-menu-item >Brown</button>
        <button mat-menu-item>Pink</button>
      </mat-menu>`
  })
};
