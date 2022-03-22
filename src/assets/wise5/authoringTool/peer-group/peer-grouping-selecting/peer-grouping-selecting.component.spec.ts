import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupingSelectingComponent } from './peer-grouping-selecting.component';

describe('PeerGroupingSelectingComponent', () => {
  let component: PeerGroupingSelectingComponent;
  let fixture: ComponentFixture<PeerGroupingSelectingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerGroupingSelectingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupingSelectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
