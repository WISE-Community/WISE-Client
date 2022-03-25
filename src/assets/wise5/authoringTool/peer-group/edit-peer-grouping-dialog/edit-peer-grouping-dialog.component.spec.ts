import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';

describe('EditPeerGroupingDialogComponent', () => {
  let component: EditPeerGroupingDialogComponent;
  let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPeerGroupingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
