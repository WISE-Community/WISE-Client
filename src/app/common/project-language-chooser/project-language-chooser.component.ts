import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Language } from '../../domain/language';
import { ProjectLocale } from '../../domain/projectLocale';

@Component({
  standalone: true,
  selector: 'project-language-chooser',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './project-language-chooser.component.html'
})
export class ProjectLanguageChooserComponent implements OnChanges {
  protected availableLanguages: Language[];
  @Output() languageChangedEvent = new EventEmitter<Language>();
  @Input() projectLocale: ProjectLocale;
  protected selectedLanguage: Language;

  ngOnChanges(): void {
    this.availableLanguages = this.projectLocale.getAvailableLanguages();
    if (
      this.selectedLanguage == null ||
      !this.availableLanguages.some((lang) => lang.locale === this.selectedLanguage.locale)
    ) {
      this.selectedLanguage = this.projectLocale.getDefaultLanguage();
    }
  }

  protected isSameLanguage(lang1: Language, lang2: Language): boolean {
    return lang1 && lang2 ? lang1.locale === lang2.locale : lang1 === lang2;
  }
}
