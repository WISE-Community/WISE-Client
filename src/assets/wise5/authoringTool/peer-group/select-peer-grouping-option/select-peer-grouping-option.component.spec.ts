import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option.component';

describe('SelectPeerGroupingComponent', () => {
  let component: SelectPeerGroupingOptionComponent;
  let fixture: ComponentFixture<SelectPeerGroupingOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupingOptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
