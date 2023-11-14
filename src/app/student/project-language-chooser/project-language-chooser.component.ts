import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateProjectService } from '../../../assets/wise5/services/translateProjectService';
import { Language } from '../../domain/language';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  standalone: true,
  selector: 'project-language-chooser',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './project-language-chooser.component.html'
})
export class ProjectLanguageChooserComponent implements OnInit {
  protected availableLanguages: Language[];
  protected selectedLanguage: Language;

  constructor(
    private projectService: ProjectService,
    private translateProjectService: TranslateProjectService
  ) {}

  ngOnInit(): void {
    const unitLocale = this.projectService.getLocale();
    this.availableLanguages = unitLocale.getSupportedLanguages();
    this.selectedLanguage = this.availableLanguages.find((language) =>
      unitLocale.isDefaultLocale(language.locale)
    );
  }

  protected changeLanguage(): void {
    this.translateProjectService.translate(this.selectedLanguage.locale).subscribe();
  }
}
