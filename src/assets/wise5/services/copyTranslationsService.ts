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
    const i18nKeys = nodes.flatMap((node) =>
      node.components.flatMap((component) => this.getI18NKeys(component))
    );
    forkJoin(await this.getSaveTranslationRequests(i18nKeys)).subscribe();
    this.projectService.saveProject();
  }

  private async getSaveTranslationRequests(
    i18nKeys: I18NReplaceKey[]
  ): Promise<Observable<Object>[]> {
    const saveTranslationRequests: Observable<Object>[] = [];
    (await this.fetchAllTranslations()).forEach((translations, language) => {
      i18nKeys.forEach((i18nKey) => (translations[i18nKey.new] = translations[i18nKey.original]));
      saveTranslationRequests.push(this.getSaveTranslationRequest(translations, language));
    });
    return saveTranslationRequests;
  }

  tryCopyComponents(node: Node, components: ComponentContent[]): void {
    if (this.projectService.getLocale().hasTranslations()) {
      this.copyComponents(
        node,
        components.map((c) => c.id)
      );
    }
  }

  private async copyComponents(node: Node, componentIds: string[]): Promise<void> {
    const i18nKeys = node.components
      .filter((component) => componentIds.includes(component.id))
      .flatMap((component) => this.getI18NKeys(component));
    forkJoin(await this.getSaveTranslationRequests(i18nKeys)).subscribe();
    this.projectService.saveProject();
  }

  protected getI18NKey(componentElement: object, key: string): I18NReplaceKey {
    const originalI18NKey = componentElement[key].id;
    const newI18NKey = generateRandomKey(30);
    componentElement[key].id = newI18NKey;
    return { original: originalI18NKey, new: newI18NKey };
  }
}
