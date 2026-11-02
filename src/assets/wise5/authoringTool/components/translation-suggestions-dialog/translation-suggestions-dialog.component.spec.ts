import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TranslationSuggestionsDialogComponent } from './translation-suggestions-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

describe('TranslationSuggestionsDialogComponent', () => {
  let component: TranslationSuggestionsDialogComponent;
  let fixture: ComponentFixture<TranslationSuggestionsDialogComponent>;
  const data = {
    defaultLanguage: 'English',
    currentLanguage: 'Spanish',
    defaultLanguageContent: 'source text',
    currentLanguageContent: '',
    contentType: 'text'
  };
  let getTranslationSuggestion: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationSuggestionsDialogComponent],
      providers: [
        MockProvider(TeacherProjectTranslationService),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    getTranslationSuggestion = spyOn(
      TestBed.inject(TeacherProjectTranslationService),
      'getTranslationSuggestion'
    ).and.returnValue(of('Example translated text'));
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(TranslationSuggestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('passes the plain text content type to the translation service', () => {
    createComponent();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'English',
      'Spanish',
      'source text',
      'text'
    );
  });

  it('passes the HTML content type to the translation service', () => {
    data.contentType = 'html';
    createComponent();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'English',
      'Spanish',
      'source text',
      'html'
    );
  });
});
