import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneDetailsDialogComponent } from './milestone-details-dialog.component';

describe('MilestoneDetailsDialogComponent', () => {
  let component: MilestoneDetailsDialogComponent;
  let fixture: ComponentFixture<MilestoneDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
