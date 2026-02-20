import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationSuggestionsDialogComponent } from './translation-suggestions-dialog.component';

describe('TranslationSuggestionsDialogComponent', () => {
  let component: TranslationSuggestionsDialogComponent;
  let fixture: ComponentFixture<TranslationSuggestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationSuggestionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationSuggestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
