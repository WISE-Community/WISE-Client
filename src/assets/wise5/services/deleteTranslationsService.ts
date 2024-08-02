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
}
