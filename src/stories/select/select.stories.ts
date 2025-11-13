import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

type MatSelectStoryType = MatSelect;

const meta: Meta<MatSelectStoryType> = {
  title: 'Components/Input/Select',
  component: MatSelect,
  decorators: [
    moduleMetadata({
      imports: [MatFormFieldModule, MatInputModule, MatSelectModule]
    })
  ]
};

export default meta;
type Story = StoryObj<MatSelectStoryType>;

export const Basic: Story = {
  render: (args) => ({
    template: `@let foods = ['Pasta', 'Pizza', 'Sushi', 'Tacos' ];
      <div class="flex flex-col items-start gap-2">
        <div>
          <h4>Basic select:</h4>
          <div class="flex flex-wrap gap-2">
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Favorite food</mat-label>
              <mat-select [(value)]="favoriteFood">
                <mat-option>-- None --</mat-option>
                @for (food of foods; track food) {
                  <mat-option [value]="food">{{food}}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Favorite food</mat-label>
              <mat-select [(value)]="favoriteFood" disabled>
                <mat-option>-- None --</mat-option>
                @for (food of foods; track food) {
                  <mat-option [value]="food">{{food}}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
          <p class="pt-2">You selected: {{favoriteFood}}</p>
        </div>
        <div>
          <h4>Native HTML select:</h4>
          <mat-form-field subscriptSizing="dynamic">
            <mat-label>Favorite Food</mat-label>
            <select matNativeControl>
              <option>-- None --</option>
              @for (food of foods; track food) {
                <option [value]="food">{{food}}</option>
              }
            </select>
          </mat-form-field>
        </div>
      </div>`
  }),
  tags: ['!autodocs']
};

export const Multiple: Story = {
  render: (args) => ({
    template: `@let colors = [
    'Red',
    'Green',
    'Blue',
    'Orange',
    'Purple',
    'Pink',
    'Yellow',
    'Cyan',
    'Magenta',
    'Black',
    'White'
  ];
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Favorite colors</mat-label>
        <mat-select multiple>
          @for (color of colors; track color) {
            <mat-option [value]="color">{{color}}</mat-option>
          }
        </mat-select>
      </mat-form-field>`
  })
};

export const CustomLabel: Story = {
  name: 'Custom Selected Label',
  render: (args) => ({
    template: `@let colors = [
    'Red',
    'Green',
    'Blue',
    'Orange',
    'Purple',
    'Pink',
    'Yellow',
    'Cyan',
    'Magenta',
    'Black',
    'White'
  ];
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Favorite colors</mat-label>
        <mat-select [(value)]="colorsSelect" multiple>
          <mat-select-trigger>
            {{colorsSelect?.[0] || ''}}
            @if ((colorsSelect?.length || 0) > 1) {
              <span class="example-additional-selection">
                (+{{(colorsSelect?.length || 0) - 1}})
              </span>
            }
          </mat-select-trigger>
          @for (color of colors; track color) {
            <mat-option [value]="color">{{color}}</mat-option>
          }
        </mat-select>
      </mat-form-field>`
  })
};

export const OptionGroups: Story = {
  name: 'Option Groups',
  render: (args) => ({
    template: `@let colorGroups = [
    {
      name: 'Primary',
      colors: [
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'blue', label: 'Blue' }
      ]
    },
    {
      name: 'Secondary',
      colors: [
        { value: 'orange', label: 'Orange' },
        { value: 'purple', label: 'Purple' },
        { value: 'pink', label: 'Pink' }
      ]
    },
    {
      name: 'Tertiary',
      colors: [
        { value: 'yellow', label: 'Yellow' },
        { value: 'cyan', label: 'Cyan' },
        { value: 'magenta', label: 'Magenta' }
      ]
    }
  ];
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Choose a color</mat-label>
        <mat-select>
          <mat-option>-- None --</mat-option>
          @for (group of colorGroups; track group) {
            <mat-optgroup [label]="group.name">
              @for (color of group.colors; track color) {
                <mat-option [value]="color.value">{{color.label}}</mat-option>
              }
            </mat-optgroup>
          }
        </mat-select>
      </mat-form-field>`
  })
};
