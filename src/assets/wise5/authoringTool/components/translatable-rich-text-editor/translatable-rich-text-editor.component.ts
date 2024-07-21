import { Component, ViewChild } from '@angular/core';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { WiseTinymceEditorModule } from '../../../directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  standalone: true,
  selector: 'translatable-rich-text-editor',
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    WiseTinymceEditorModule
  ],
  templateUrl: './translatable-rich-text-editor.component.html',
  styleUrl: './translatable-rich-text-editor.component.scss'
})
export class TranslatableRichTextEditorComponent extends AbstractTranslatableFieldComponent {
  protected html: string = '';
  @ViewChild(MatTabGroup) private tabs: MatTabGroup;

  constructor(
    private configService: ConfigService,
    protected projectService: TeacherProjectService,
    protected projectTranslationService: TeacherProjectTranslationService
  ) {
    super(projectService, projectTranslationService);
  }

  ngOnChanges(): void {
    super.ngOnChanges();
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

  protected copyDefaultLanguageText(): void {
    if (
      this.translationText == undefined ||
      this.translationText === '' ||
      confirm(
        $localize`Are you sure you want to replace the content in ${
          this.currentLanguage().language
        } with content in ${this.defaultLanguage.language} for this item?`
      )
    ) {
      this.setTranslationText(this.html);
      this.translationTextChanged.next(this.html);
      this.tabs.selectedIndex = 0;
    }
  }

  protected saveTranslationText(text: string): void {
    super.saveTranslationText(insertWiseLinks(this.configService.removeAbsoluteAssetPaths(text)));
  }
}
