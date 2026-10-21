import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { Language } from '../../domain/language';
import { ProjectLocale } from '../../domain/projectLocale';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  selector: 'project-language-chooser',
  styleUrl: './project-language-chooser.component.scss',
  templateUrl: './project-language-chooser.component.html'
})
export class ProjectLanguageChooserComponent {
  private projectService = inject(ProjectService);

  readonly projectLocale = input<ProjectLocale>();
  readonly tooltip = input<string>($localize`Select language`);
  readonly languageChangedEvent = output<Language>();

  protected readonly availableLanguages = computed<Language[]>(() => {
    return this.projectLocale()?.getAvailableLanguages() ?? [];
  });

  protected readonly selectedLanguage = linkedSignal<Language | null>(() => {
    const locale = this.projectLocale();
    if (locale == null) {
      return null;
    }
    const available = locale.getAvailableLanguages();
    const current = this.projectService.currentLanguage();
    if (current != null && available.some((lang) => lang.locale === current.locale)) {
      return current;
    }
    return locale.getDefaultLanguage();
  });

  protected changeLanguage(language: Language): void {
    this.selectedLanguage.set(language);
    this.languageChangedEvent.emit(language);
  }
}

