import { Component, inject, ViewChild } from '@angular/core';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { WiseAuthoringTinymceEditorComponent } from '../../../directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatTabsModule, WiseAuthoringTinymceEditorComponent],
  selector: 'translatable-rich-text-editor',
  styles: ['.translation-tools { padding: 8px 0; }'],
  templateUrl: './translatable-rich-text-editor.component.html'
})
export class TranslatableRichTextEditorComponent extends AbstractTranslatableFieldComponent {
  protected html: string = '';
  @ViewChild(MatTabGroup) private tabs: MatTabGroup;

  private configService = inject(ConfigService);

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
