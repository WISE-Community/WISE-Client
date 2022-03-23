import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPeerGroupingComponent } from './display-peer-grouping.component';

describe('DisplayPeerGroupingComponent', () => {
  let component: DisplayPeerGroupingComponent;
  let fixture: ComponentFixture<DisplayPeerGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPeerGroupingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPeerGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
