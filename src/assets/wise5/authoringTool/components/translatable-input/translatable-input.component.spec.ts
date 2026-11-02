import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NEVER } from 'rxjs';
import { ConfigService } from '../../../services/configService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TranslatableInputComponent } from './translatable-input.component';
import { MatDialog } from '@angular/material/dialog';

describe('TranslatableInputComponent', () => {
  let component: TranslatableInputComponent;
  let fixture: ComponentFixture<TranslatableInputComponent>;
  let getTranslationSuggestion: jasmine.Spy;

  beforeEach(() => {
    getTranslationSuggestion = jasmine.createSpy().and.returnValue(NEVER);
    TestBed.configureTestingModule({
      imports: [TranslatableInputComponent],
      providers: [
        {
          provide: ConfigService,
          useValue: { getConfigParam: () => true }
        },
        {
          provide: TeacherProjectService,
          useValue: {
            currentLanguage: signal({ language: 'Spanish', locale: 'es' }),
            getLocale: () => new ProjectLocale({ default: 'en-US' }),
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
    fixture = TestBed.createComponent(TranslatableInputComponent);
    component = fixture.componentInstance;
    component.content = { source: 'Plain input' };
    component.key = 'source';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests a plain text translation', () => {
    fixture.nativeElement.querySelector('.translation-link a').click();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'English',
      'Spanish',
      'Plain input',
      'text'
    );
  });
});
