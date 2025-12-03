import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

type MatFormFieldStoryType = MatFormField & { appearance?: 'fill' | 'outline' };

const meta: Meta<MatFormFieldStoryType> = {
  title: 'Components/Input/Form Field',
  component: MatFormField,
  decorators: [
    moduleMetadata({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule
      ]
    })
  ],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['', 'fill', 'outline'],
      description: `'fill' | 'outline'`,
      type: 'string',
      table: { defaultValue: { summary: 'fill' } }
    }
  }
};

export default meta;
type Story = StoryObj<MatFormFieldStoryType>;

export const Basic: Story = {
  render: (args) => ({
    template: `<div class="flex flex-col items-start">
        <mat-form-field ${args.appearance ? 'appearance="' + args.appearance + '"' : ''}>
          <mat-label>Input</mat-label>
          <input matInput>
        </mat-form-field>
        <mat-form-field ${args.appearance ? 'appearance="' + args.appearance + '"' : ''}>
          <mat-label>Select</mat-label>
          <mat-select>
            <mat-option value="one">First option</mat-option>
            <mat-option value="two">Second option</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field ${args.appearance ? 'appearance="' + args.appearance + '"' : ''}>
          <mat-label>Textarea</mat-label>
          <textarea matInput></textarea>
        </mat-form-field>
      </div>`
  }),
  tags: ['!autodocs', '!dev']
};

export const Fill: Story = {
  render: (args) => ({
    template: `<mat-form-field appearance="fill">
        <mat-label>Input</mat-label>
        <input matInput>
      </mat-form-field>`
  })
};

export const Outline: Story = {
  render: (args) => ({
    template: `<mat-form-field appearance="outline">
        <mat-label>Input</mat-label>
        <input matInput>
      </mat-form-field>`
  })
};

export const HintsErrors: Story = {
  name: 'Hints and Errors',
  render: (args) => ({
    template: `<div class="flex flex-wrap gap-2">
        <mat-form-field hintLabel="Max 10 characters">
          <mat-label>Enter some input</mat-label>
          <input matInput #input name="input" maxlength="10" placeholder="Placeholder"/>
          <mat-hint align="end">{{input.value.length}}/10</mat-hint>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Required field</mat-label>
          <input
            matInput
            [(ngModel)]="requiredVal"
            name="requiredVal"
            #requiredField="ngModel"
            placeholder="Input something"
            required
          />
          @if (requiredField.hasError('required')) {
            <mat-error>Input is required</mat-error>
          }
        </mat-form-field>
      </div>`
  })
};

export const Labels: Story = {
  render: (args) => ({
    template: `<div class="flex flex-wrap gap-2">
        <mat-form-field>
          <mat-label>Label</mat-label>
          <input matInput placeholder="Placeholder"/>
        </mat-form-field>
        <mat-form-field floatLabel="always">
          <mat-label>Always Floating Label</mat-label>
          <input matInput placeholder="Placeholder"/>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Placeholder Only"/>
        </mat-form-field>
      </div>`
  })
};

export const PrefixSuffix: Story = {
  name: 'Prefix and Suffix',
  render: (args) => ({
    props: { hide: true },
    template: `<div class="flex flex-wrap gap-2">
        <mat-form-field>
          <mat-label>Enter your password</mat-label>
          <input matInput [type]="hide ? 'password' : 'text'" />
          <button
            mat-icon-button
            matSuffix
            (click)="hide = !hide; $event.preventDefault();"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hide"
          >
            <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Name" />
          <span matTextPrefix>&#64;&nbsp;</span>
          <mat-icon matSuffix aria-label="person">person</mat-icon>
        </mat-form-field>
      </div>`
  })
};
