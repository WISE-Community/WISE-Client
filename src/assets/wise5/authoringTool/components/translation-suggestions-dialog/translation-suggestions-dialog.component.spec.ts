import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TranslationSuggestionsDialogComponent } from './translation-suggestions-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

fdescribe('TranslationSuggestionsDialogComponent', () => {
  let component: TranslationSuggestionsDialogComponent;
  let fixture: ComponentFixture<TranslationSuggestionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationSuggestionsDialogComponent],
      providers: [
        MockProvider(TeacherProjectTranslationService),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    spyOn(
      TestBed.inject(TeacherProjectTranslationService),
      'getTranslationSuggestion'
    ).and.returnValue(of('Example translated text'));

    fixture = TestBed.createComponent(TranslationSuggestionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
