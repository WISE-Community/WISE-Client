import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { NEVER } from 'rxjs';
import { TranslatableRichTextEditorComponent } from './translatable-rich-text-editor.component';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { MatDialog } from '@angular/material/dialog';
import { WiseAuthoringTinymceEditorComponent } from '../../../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { Language } from '../../../../../app/domain/language';

@Component({
  selector: 'wise-authoring-tinymce-editor',
  template: ''
})
class WiseAuthoringTinymceEditorStubComponent {
  @Input() language: Language;
  @Input() model: string;
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<string>();
}

describe('TranslatableRichTextEditorComponent', () => {
  let component: TranslatableRichTextEditorComponent;
  let fixture: ComponentFixture<TranslatableRichTextEditorComponent>;
  let getTranslationSuggestion: jasmine.Spy;

  beforeEach(() => {
    getTranslationSuggestion = jasmine.createSpy().and.returnValue(NEVER);
    TestBed.configureTestingModule({
      imports: [TranslatableRichTextEditorComponent],
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
            isDefaultLocale: () => false,
            replaceAssetPaths: (text: string) => text
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
    TestBed.overrideComponent(TranslatableRichTextEditorComponent, {
      remove: { imports: [WiseAuthoringTinymceEditorComponent] },
      add: { imports: [WiseAuthoringTinymceEditorStubComponent] }
    });
    fixture = TestBed.createComponent(TranslatableRichTextEditorComponent);
    component = fixture.componentInstance;
    component.content = { source: '<p>Rich source</p>' };
    component.key = 'source';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests an HTML translation', () => {
    fixture.nativeElement.querySelector('.translation-link a').click();
    expect(getTranslationSuggestion).toHaveBeenCalledWith(
      'English',
      'Spanish',
      '<p>Rich source</p>',
      'html'
    );
  });
});
