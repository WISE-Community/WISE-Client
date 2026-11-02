import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NEVER } from 'rxjs';
import { ConfigService } from '../../../services/configService';
import { TranslatableTextareaComponent } from './translatable-textarea.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { MatDialog } from '@angular/material/dialog';

describe('TranslatableTextareaComponent', () => {
  let component: TranslatableTextareaComponent;
  let fixture: ComponentFixture<TranslatableTextareaComponent>;
  let getTranslationSuggestion: jasmine.Spy;

  beforeEach(() => {
    getTranslationSuggestion = jasmine.createSpy().and.returnValue(NEVER);
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
    fixture = TestBed.createComponent(TranslatableTextareaComponent);
    component = fixture.componentInstance;
    component.content = { source: 'Plain textarea' };
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
      'Plain textarea',
      'text'
    );
  });
});
