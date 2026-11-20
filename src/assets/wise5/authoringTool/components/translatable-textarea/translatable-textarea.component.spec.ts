import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { NEVER } from 'rxjs';
import { ConfigService } from '../../../services/configService';
import { TranslatableTextareaComponent } from './translatable-textarea.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { MatDialog } from '@angular/material/dialog';
import { Language } from '../../../../../app/domain/language';

describe('TranslatableTextareaComponent', () => {
  let component: TranslatableTextareaComponent;
  let fixture: ComponentFixture<TranslatableTextareaComponent>;
  let getTranslationSuggestion: jasmine.Spy;
  let projectLocale: ProjectLocale;
  let currentLanguage: WritableSignal<Language>;

  beforeEach(() => {
    getTranslationSuggestion = jasmine.createSpy().and.returnValue(NEVER);
    projectLocale = new ProjectLocale({ default: 'en_US' });
    currentLanguage = signal({ language: 'Spanish', locale: 'es' });
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        StudentTeacherCommonServicesModule,
        TranslatableTextareaComponent
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: { getConfigParam: () => true }
        },
        {
          provide: TeacherProjectService,
          useValue: {
            currentLanguage,
            getLocale: () => projectLocale,
            isDefaultLocale: () => false
          }
        },
        {
          provide: TeacherProjectTranslationService,
          useValue: {
            currentTranslations: signal({}),
            getTranslationSuggestion
          }
        },
        { provide: MatDialog, useValue: {} }
      ]
    });

    createFixture();
  });

  function createFixture(
    locale = 'en_US',
    language: Language = { language: 'Spanish', locale: 'es' }
  ): void {
    projectLocale = new ProjectLocale({ default: locale });
    currentLanguage.set(language);
    fixture = TestBed.createComponent(TranslatableTextareaComponent);
    component = fixture.componentInstance;
    component.content = { source: 'Plain textarea' };
    component.key = 'source';
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests a plain text translation', () => {
    fixture.nativeElement.querySelector('.translation-link a').click();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'English',
      'Spanish',
      'Plain textarea',
      'text'
    );
  });

  it('requests a plain text translation for a non-English pair', () => {
    fixture.destroy();
    createFixture('es', { language: 'French', locale: 'fr' });

    fixture.nativeElement.querySelector('.translation-link a').click();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'Spanish',
      'French',
      'Plain textarea',
      'text'
    );
  });
});
