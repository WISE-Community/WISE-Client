import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsAutocompleteExampleComponent } from './chips-autocomplete.component';

describe('ChipsAutocompleteExampleComponent', () => {
  let component: ChipsAutocompleteExampleComponent;
  let fixture: ComponentFixture<ChipsAutocompleteExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipsAutocompleteExampleComponent]
    });
    fixture = TestBed.createComponent(ChipsAutocompleteExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
