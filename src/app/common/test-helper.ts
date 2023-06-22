import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function getErrorMessage(fixture: ComponentFixture<any>): string {
  const error = fixture.debugElement.query(By.css('mat-error'));
  return error.nativeElement.textContent;
}
