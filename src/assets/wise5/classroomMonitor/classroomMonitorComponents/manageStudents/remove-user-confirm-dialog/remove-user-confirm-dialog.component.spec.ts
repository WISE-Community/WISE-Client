import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserConfirmDialogComponent } from './remove-user-confirm-dialog.component';

describe('RemoveUserConfirmDialogComponent', () => {
  let component: RemoveUserConfirmDialogComponent;
  let fixture: ComponentFixture<RemoveUserConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveUserConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
