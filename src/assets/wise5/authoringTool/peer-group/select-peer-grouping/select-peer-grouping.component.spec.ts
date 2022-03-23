import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupingComponent } from './select-peer-grouping.component';

describe('SelectPeerGroupingComponent', () => {
  let component: SelectPeerGroupingComponent;
  let fixture: ComponentFixture<SelectPeerGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
