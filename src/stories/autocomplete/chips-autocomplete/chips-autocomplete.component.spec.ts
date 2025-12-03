import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsAutocompleteComponent } from './chips-autocomplete.component';

describe('ChipsAutocompleteComponent', () => {
  let component: ChipsAutocompleteComponent;
  let fixture: ComponentFixture<ChipsAutocompleteComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
