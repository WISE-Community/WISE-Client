import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormsModule } from '@angular/forms';

const meta: Meta = {
  title: 'Components/Input/Timepicker',
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatTimepickerModule
      ]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Choose a time</mat-label>
        <input matInput [matTimepicker]="picker">
        <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
        <mat-timepicker #picker></mat-timepicker>
      </mat-form-field>
    `
  })
};

export const CustomInterval: Story = {
  render: () => ({
    template: `
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Choose a time</mat-label>
        <input matInput [matTimepicker]="picker">
        <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
        <mat-timepicker #picker interval="2.5h"></mat-timepicker>
      </mat-form-field>
    `
  })
};

export const CustomOptions: Story = {
  args: {
    customOptions: [
      { label: 'Morning', value: new Date(0, 0, 1, 8, 0, 0) },
      { label: 'Noon', value: new Date(0, 0, 1, 12, 0, 0) },
      { label: 'Evening', value: new Date(0, 0, 1, 18, 0, 0) }
    ]
  },
  render: (args) => ({
    props: args,
    template: `
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Choose a time</mat-label>
        <input matInput [matTimepicker]="picker">
        <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
        <mat-timepicker #picker [options]="customOptions"></mat-timepicker>
      </mat-form-field>
    `
  })
};

export const WithDatepicker: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4">
        <mat-form-field subscriptSizing="dynamic">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="datepicker" [(ngModel)]="value">
          <mat-datepicker #datepicker></mat-datepicker>
          <mat-datepicker-toggle matSuffix [for]="datepicker"></mat-datepicker-toggle>
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic">
          <mat-label>Choose a time</mat-label>
          <input matInput [matTimepicker]="timePicker" [(ngModel)]="value">
          <mat-timepicker #timePicker></mat-timepicker>
          <mat-timepicker-toggle matSuffix [for]="timePicker"></mat-timepicker-toggle>
        </mat-form-field>
      </div>
      <p class="pt-4">Date and time: {{value}}</p>
    `
  })
};
