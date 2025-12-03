import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

const meta: Meta = {
  title: 'Components/Input/Datepicker',
  decorators: [
    moduleMetadata({
      imports: [
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatCardModule
      ]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <mat-form-field>
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepicker]="picker">
        <mat-hint>MM/DD/YYYY</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    `
  })
};

export const InlineCalendar: Story = {
  render: () => ({
    template: `
      <mat-card class="w-[300px]" appearance="filled">
        <mat-calendar [(selected)]="selected"></mat-calendar>
      </mat-card>
      <p class="pt-4">Selected date: {{ selected }}</p>
    `
  })
};
