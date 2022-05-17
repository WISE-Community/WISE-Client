import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export function getDialogOpenSpy(returnValue: any) {
  return spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
    afterClosed: () => {
      return of(returnValue);
    }
  } as MatDialogRef<any>);
}
