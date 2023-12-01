import { Component } from '@angular/core';
import { Language } from '../../../../../app/domain/language';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { localeToLanguage } from '../../../../../app/domain/localeToLanguage';

@Component({
  selector: 'edit-project-language-setting',
  templateUrl: './edit-project-language-setting.component.html'
})
export class EditProjectLanguageSettingComponent {
  protected availableLanguages: Language[] = Object.entries(
    localeToLanguage
  ).map(([locale, language]) => ({ locale: locale, language: language }));
  protected defaultLanguage: Language;
  private projectLocale: ProjectLocale;
  protected supportedLanguages: Language[];

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.projectLocale = this.projectService.getLocale();
    this.defaultLanguage = this.projectLocale.getDefaultLanguage();
    this.supportedLanguages = this.projectLocale.getSupportedLanguages();
  }

  protected updateDefaultLanguage(): void {
    this.projectLocale.setDefaultLocale(this.defaultLanguage.locale);
    this.projectService.saveProject();
  }

  protected updateSupportedLanguages(): void {
    this.projectLocale.setSupportedLanguages(this.supportedLanguages);
    this.projectService.saveProject();
  }
}
