import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { ComponentContent } from '../common/ComponentContent';
import { EditTranslationsService } from './editProjectTranslationsService';

@Injectable()
export class DeleteTranslationsService extends EditTranslationsService {
  tryDeleteComponents(components: ComponentContent[]): void {
    if (this.projectService.getLocale().hasTranslations()) {
      this.deleteComponents(components);
    }
  }

  private async deleteComponents(components: ComponentContent[]): Promise<void> {
    const allTranslations = await this.fetchAllTranslations();
    const i18nKeys = components.flatMap((component) => this.getI18NKeys(component));
    const saveTranslationRequests: Observable<Object>[] = [];
    allTranslations.forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => delete translations[i18nKey]);
      saveTranslationRequests.push(
        this.http.post(
          `/api/author/project/translate/${this.configService.getProjectId()}/${language.locale}`,
          translations
        )
      );
    });
    forkJoin(saveTranslationRequests).subscribe();
  }

  private getI18NKeys(componentElement: object): string[] {
    let i18nKeys = Object.keys(componentElement)
      .filter((key) => key.endsWith('.i18n'))
      .map((key) => componentElement[key].id);
    Object.values(componentElement).forEach((value) => {
      if (Array.isArray(value)) {
        i18nKeys = i18nKeys.concat(...value.map((val) => this.getI18NKeys(val)));
      } else if (typeof value === 'object' && value != null) {
        i18nKeys = i18nKeys.concat(this.getI18NKeys(value));
      }
    });
    return i18nKeys;
  }
}
