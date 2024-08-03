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
    const i18nKeys = components.flatMap((component) => this.getI18NKeys(component));
    const saveTranslationRequests: Observable<Object>[] = [];
    (await this.fetchAllTranslations()).forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => delete translations[i18nKey]);
      saveTranslationRequests.push(this.getSaveTranslationRequest(translations, language));
    });
    forkJoin(saveTranslationRequests).subscribe();
  }
}
