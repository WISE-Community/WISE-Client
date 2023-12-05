import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ProjectLanguageChooserComponent implements OnInit {
  protected availableLanguages: Language[];
  @Output() languageChangedEvent = new EventEmitter<Language>();
  @Input() projectLocale: ProjectLocale;
  protected selectedLanguage: Language;

  ngOnInit(): void {
    this.availableLanguages = this.projectLocale.getAvailableLanguages();
    this.selectedLanguage = this.availableLanguages.find((language) =>
      this.projectLocale.isDefaultLocale(language.locale)
    );
  }
}
