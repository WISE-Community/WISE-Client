import { computed, signal } from '@angular/core';
import {
  IdeasPresentationItem,
  IdeasPresentationResponse,
  getIdeasResponseKey
} from '../models/teacher-presentation-config';

export class IdeasSelectionState {
  readonly selectedIdeaIds = signal<Set<string>>(new Set<string>());
  readonly selectedIdeaResponseMap = signal<Map<string, Map<string, IdeasPresentationResponse>>>(
    new Map<string, Map<string, IdeasPresentationResponse>>()
  );
  readonly standaloneResponses = signal<Map<string, IdeasPresentationResponse>>(
    new Map<string, IdeasPresentationResponse>()
  );

  readonly hasSelections = computed(
    () => this.selectedIdeaIds().size > 0 || this.standaloneResponses().size > 0
  );

  isIdeaSelected(ideaId: string): boolean {
    return this.selectedIdeaIds().has(ideaId);
  }

  isIdeaResponseSelected(ideaId: string, response: IdeasPresentationResponse): boolean {
    const key = getIdeasResponseKey(response);
    if (this.selectedIdeaResponseMap().get(ideaId)?.has(key)) {
      return true;
    }
    if (this.isResponseInAnyIdea(key)) {
      return false;
    }
    return !this.selectedIdeaIds().has(ideaId) && this.standaloneResponses().has(key);
  }

  toggleIdea(ideaId: string, candidates?: IdeasPresentationResponse[]): boolean {
    const currentIdeas = new Set(this.selectedIdeaIds());
    const currentMap = new Map(this.selectedIdeaResponseMap());
    const currentStandalone = new Map(this.standaloneResponses());

    if (currentIdeas.has(ideaId)) {
      // Uncheck category only: selected child responses stay selected as standalone
      currentIdeas.delete(ideaId);
      currentMap.get(ideaId)?.forEach((response, key) => currentStandalone.set(key, response));
    } else {
      // Check category: restore category and adopt standalone responses that belong to it
      currentIdeas.add(ideaId);
      const ideaResponses = new Map(currentMap.get(ideaId) ?? []);
      candidates?.forEach((candidate) => {
        const key = getIdeasResponseKey(candidate);
        const standalone = currentStandalone.get(key);
        if (standalone && !this.isResponseInAnyIdea(key, currentMap)) {
          ideaResponses.set(key, standalone);
          currentStandalone.delete(key);
        }
      });
      ideaResponses.forEach((_, key) => {
        if (!this.isResponseInAnyUnselectedIdea(key, currentIdeas, currentMap)) {
          currentStandalone.delete(key);
        }
      });
      currentMap.set(ideaId, ideaResponses);
    }

    this.selectedIdeaIds.set(currentIdeas);
    this.selectedIdeaResponseMap.set(currentMap);
    this.standaloneResponses.set(currentStandalone);
    return true;
  }

  toggleIdeaResponse(ideaId: string, response: IdeasPresentationResponse): boolean {
    const key = getIdeasResponseKey(response);
    const currentIdeas = new Set(this.selectedIdeaIds());
    const currentMap = new Map(this.selectedIdeaResponseMap());
    const currentStandalone = new Map(this.standaloneResponses());

    const ideaResponses = new Map(currentMap.get(ideaId) ?? []);
    const isSelected = this.isIdeaResponseSelected(ideaId, response);

    if (isSelected) {
      ideaResponses.delete(key);
      currentMap.set(ideaId, ideaResponses);
      if (!this.isResponseInAnyUnselectedIdea(key, currentIdeas, currentMap)) {
        currentStandalone.delete(key);
      }
      // Category remains selected per requirements
    } else {
      ideaResponses.set(key, response);
      currentMap.set(ideaId, ideaResponses);
      // Auto-check parent category
      currentIdeas.add(ideaId);
      if (!this.isResponseInAnyUnselectedIdea(key, currentIdeas, currentMap)) {
        currentStandalone.delete(key);
      }
    }

    this.selectedIdeaIds.set(currentIdeas);
    this.selectedIdeaResponseMap.set(currentMap);
    this.standaloneResponses.set(currentStandalone);
    return true;
  }

  private isResponseInAnyIdea(
    key: string,
    responseMap: Map<string, Map<string, IdeasPresentationResponse>> =
      this.selectedIdeaResponseMap()
  ): boolean {
    for (const responses of responseMap.values()) {
      if (responses.has(key)) {
        return true;
      }
    }
    return false;
  }

  private isResponseInAnyUnselectedIdea(
    key: string,
    selectedIdeas: Set<string>,
    responseMap: Map<string, Map<string, IdeasPresentationResponse>>
  ): boolean {
    for (const [ideaId, responses] of responseMap.entries()) {
      if (!selectedIdeas.has(ideaId) && responses.has(key)) {
        return true;
      }
    }
    return false;
  }

  clear(): boolean {
    if (this.selectedIdeaIds().size === 0 && this.standaloneResponses().size === 0) {
      return false;
    }
    this.reset();
    return true;
  }

  reset(): void {
    this.selectedIdeaIds.set(new Set<string>());
    this.selectedIdeaResponseMap.set(new Map<string, Map<string, IdeasPresentationResponse>>());
    this.standaloneResponses.set(new Map<string, IdeasPresentationResponse>());
  }

  loadFromItems(items: any[]): void {
    const ideaIds = new Set<string>();
    const respMap = new Map<string, Map<string, IdeasPresentationResponse>>();
    const standalone = new Map<string, IdeasPresentationResponse>();

    items?.forEach((item: any) => {
      const responses: IdeasPresentationResponse[] = item.responses ?? [];
      const byKey = new Map(responses.map((r) => [getIdeasResponseKey(r), r]));
      if (item.ideaId != null) {
        ideaIds.add(item.ideaId);
        respMap.set(item.ideaId, byKey);
      } else {
        byKey.forEach((response, key) => standalone.set(key, response));
      }
    });

    this.selectedIdeaIds.set(ideaIds);
    this.selectedIdeaResponseMap.set(respMap);
    this.standaloneResponses.set(standalone);
  }

  toPayloadItems(): IdeasPresentationItem[] {
    const ideasItems: IdeasPresentationItem[] = [];
    for (const ideaId of this.selectedIdeaIds()) {
      ideasItems.push({
        ideaId,
        responses: Array.from(this.selectedIdeaResponseMap().get(ideaId)?.values() ?? [])
      });
    }
    if (this.standaloneResponses().size > 0) {
      ideasItems.push({
        ideaId: null,
        responses: Array.from(this.standaloneResponses().values())
      });
    }
    return ideasItems;
  }
}
