import { AbstractControl } from '@angular/forms';

export function setFormControlValue(component: any, formControlName: string, value: string): void {
  getFormControl(component, formControlName).setValue(value);
}

export function getFormControl(component: any, formControlName: string): AbstractControl {
  return component.formGroup.controls[formControlName];
}

export function hasError(component: any, formControlName: string, errorName: string): boolean {
  return getFormControl(component, formControlName).hasError(errorName);
}
