import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Language } from '../../domain/language';
import { ProjectLocale } from '../../domain/projectLocale';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'project-language-chooser',
  styleUrl: './project-language-chooser.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './project-language-chooser.component.html'
})
export class ProjectLanguageChooserComponent implements OnChanges {
  protected availableLanguages: Language[];
  @Output() languageChangedEvent = new EventEmitter<Language>();
  @Input() projectLocale: ProjectLocale;
  protected selectedLanguage: Language;
  @Input() tooltip: string = $localize`Select language`;

  ngOnChanges(): void {
    this.availableLanguages = this.projectLocale.getAvailableLanguages();
    if (
      this.selectedLanguage == null ||
      !this.availableLanguages.some((lang) => lang.locale === this.selectedLanguage.locale)
    ) {
      this.selectedLanguage = this.projectLocale.getDefaultLanguage();
    }
  }

  protected changeLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.languageChangedEvent.emit(language);
  }
}
