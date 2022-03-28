import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring.component';

describe('SelectPeerGroupingAuthoringComponent', () => {
  let component: SelectPeerGroupingAuthoringComponent;
  let fixture: ComponentFixture<SelectPeerGroupingAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPeerGroupingAuthoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
