import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';

describe('SelectPeerGroupingDialogComponent', () => {
  let component: SelectPeerGroupingDialogComponent;
  let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupingDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
