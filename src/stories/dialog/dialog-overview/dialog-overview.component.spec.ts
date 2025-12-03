import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOverviewComponent } from './dialog-overview.component';

describe('DialogOverviewComponent', () => {
  let component: DialogOverviewComponent;
  let fixture: ComponentFixture<DialogOverviewComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
