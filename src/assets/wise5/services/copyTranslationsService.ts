import { Injectable } from '@angular/core';
import { EditTranslationsService } from './editProjectTranslationsService';
import { Node } from '../common/Node';
import { Observable, forkJoin } from 'rxjs';
import { generateRandomKey } from '../common/string/string';
import { ComponentContent } from '../common/ComponentContent';

interface I18NReplaceKey {
  new: string;
  original: string;
}

@Injectable()
export class CopyTranslationsService extends EditTranslationsService {
  tryCopyNodes(nodes: Node[]): void {
    if (this.projectService.getLocale().hasTranslations()) {
      this.copyNodes(nodes);
    }
  }

  private async copyNodes(nodes: Node[]): Promise<void> {
    const allTranslations = await this.fetchAllTranslations();
    const i18nKeys = nodes.flatMap((node) =>
      node.components.flatMap((component) => this.replaceI18NKeys(component))
    );
    const saveTranslationRequests: Observable<Object>[] = [];
    allTranslations.forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => (translations[i18nKey.new] = translations[i18nKey.original]));
      saveTranslationRequests.push(
        this.http.post(
          `/api/author/project/translate/${this.configService.getProjectId()}/${language.locale}`,
          translations
        )
      );
    });
    forkJoin(saveTranslationRequests).subscribe();
    this.projectService.saveProject();
  }

  tryCopyComponents(node: Node, components: ComponentContent[]): void {
    if (this.projectService.getLocale().hasTranslations()) {
      this.copyTranslations(
        node,
        components.map((c) => c.id)
      );
    }
  }

  private async copyTranslations(node: Node, componentIds: string[]): Promise<void> {
    const allTranslations = await this.fetchAllTranslations();
    const i18nKeys = node.components
      .filter((component) => componentIds.includes(component.id))
      .flatMap((component) => this.replaceI18NKeys(component));
    const saveTranslationRequests: Observable<Object>[] = [];
    allTranslations.forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => (translations[i18nKey.new] = translations[i18nKey.original]));
      saveTranslationRequests.push(
        this.http.post(
          `/api/author/project/translate/${this.configService.getProjectId()}/${language.locale}`,
          translations
        )
      );
    });
    forkJoin(saveTranslationRequests).subscribe();
    this.projectService.saveProject();
  }

  protected replaceI18NKeys(componentElement: object): I18NReplaceKey[] {
    let i18nKeys = Object.keys(componentElement)
      .filter((key) => key.endsWith('.i18n'))
      .map((key) => {
        const originalI18NKey = componentElement[key].id;
        const newI18NKey = generateRandomKey(30);
        componentElement[key].id = newI18NKey;
        return { original: originalI18NKey, new: newI18NKey };
      });
    Object.values(componentElement).forEach((value) => {
      if (Array.isArray(value)) {
        i18nKeys = i18nKeys.concat(...value.map((val) => this.replaceI18NKeys(val)));
      } else if (typeof value === 'object' && value != null) {
        i18nKeys = i18nKeys.concat(this.replaceI18NKeys(value));
      }
    });
    return i18nKeys;
  }
}
