import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupingDisplayComponent } from './peer-grouping-display.component';

describe('PeerGroupingDisplayComponent', () => {
  let component: PeerGroupingDisplayComponent;
  let fixture: ComponentFixture<PeerGroupingDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerGroupingDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
