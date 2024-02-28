import { Component, computed } from '@angular/core';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { WiseTinymceEditorModule } from '../../../directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslateProjectService } from '../../../services/translateProjectService';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'translatable-rich-text-editor',
  imports: [CommonModule, MatDialogModule, MatTabsModule, WiseTinymceEditorModule],
  templateUrl: './translatable-rich-text-editor.component.html'
})
export class TranslatableRichTextEditorComponent extends AbstractTranslatableFieldComponent {
  protected html: string = '';

  constructor(
    private configService: ConfigService,
    protected editProjectTranslationService: EditProjectTranslationService,
    protected projectService: TeacherProjectService,
    protected translateProjectService: TranslateProjectService
  ) {
    super(editProjectTranslationService, projectService, translateProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.projectService.replaceAssetPaths(replaceWiseLinks(this.content[this.key]));
    this.translationText = computed(() =>
      this.projectService.replaceAssetPaths(
        replaceWiseLinks(this.translateProjectService.currentTranslations()[this.i18nId]?.value)
      )
    );
  }

  protected setLanguage(): void {
    // this call is required to fetch and keep the translations for the
    // current language up-to-date when switching between language tabs
    this.projectService.setCurrentLanguage(this.projectService.currentLanguage());
  }

  protected saveDefaultLanguageText(): void {
    this.content[this.key] = insertWiseLinks(
      this.configService.removeAbsoluteAssetPaths(this.html)
    );
    this.defaultLanguageTextChanged.next(this.content[this.key]);
  }

  protected saveTranslationText(text: string): void {
    super.saveTranslationText(insertWiseLinks(this.configService.removeAbsoluteAssetPaths(text)));
  }
}
