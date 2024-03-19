import { Component } from '@angular/core';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { WiseTinymceEditorModule } from '../../../directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
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
    protected projectService: TeacherProjectService,
    protected projectTranslationService: TeacherProjectTranslationService
  ) {
    super(projectService, projectTranslationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.projectService.replaceAssetPaths(replaceWiseLinks(this.content[this.key]));
  }

  protected setTranslationText(text: string): void {
    this.translationText = this.projectService.replaceAssetPaths(replaceWiseLinks(text));
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
