import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupingAuthoringComponent } from './peer-grouping-authoring.component';

describe('PeerGroupingAuthoringComponent', () => {
  let component: PeerGroupingAuthoringComponent;
  let fixture: ComponentFixture<PeerGroupingAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerGroupingAuthoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupingAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
