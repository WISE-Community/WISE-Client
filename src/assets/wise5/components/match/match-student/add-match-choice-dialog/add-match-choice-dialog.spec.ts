import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddMatchChoiceDialogComponent } from './add-match-choice-dialog';

let dialogRef: jasmine.SpyObj<MatDialogRef<AddMatchChoiceDialogComponent>>;
let fixture: ComponentFixture<AddMatchChoiceDialogComponent>;
let input: HTMLInputElement;

describe('AddMatchChoiceDialogComponent', () => {
  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [AddMatchChoiceDialogComponent, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }]
    });
    fixture = TestBed.createComponent(AddMatchChoiceDialogComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
    input.value = '中文';
    input.dispatchEvent(new Event('input'));
  });

  it('should not close the dialog when Enter confirms an IME composition', () => {
    const event = pressEnter({ isComposing: true });
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBeFalse();
  });

  it('should not close the dialog when Enter has the IME key code', () => {
    const event = pressEnter({}, 229);
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBeFalse();
  });

  it('should close the dialog with the text when Enter is pressed', () => {
    const event = pressEnter();
    expect(dialogRef.close).toHaveBeenCalledOnceWith('中文');
    expect(event.defaultPrevented).toBeTrue();
  });
});

function pressEnter(init: KeyboardEventInit = {}, keyCode: number = 13): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, ...init });
  Object.defineProperty(event, 'keyCode', { value: keyCode });
  input.dispatchEvent(event);
  return event;
}
