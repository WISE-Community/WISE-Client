import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import {
  getIdeasResponseKey,
  IdeasPresentationItem,
  IdeasPresentationResponse,
  StudentNamesDisplayMode,
  TeacherPresentationConfig,
  TeacherPresentationItem,
  TeacherPresentationItemType
} from './teacher-presentation-config';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherPresentationSelectionStore {
  private configService = inject(TeacherPresentationConfigService);

  private saveSubject = new Subject<void>();

  // State signals
  runId = signal<number | null>(null);
  periodId = signal<number | null>(null);
  nodeId = signal<string>('');
  componentId = signal<string>('');
  componentType = signal<string>('');
  itemType = signal<TeacherPresentationItemType>('Discussion');

  // Discussion selections
  selectedIds = signal<Set<number>>(new Set<number>());

  // Ideas selections, keyed by getIdeasResponseKey()
  selectedIdeaIds = signal<Set<string>>(new Set<string>());
  selectedIdeaResponseMap = signal<Map<string, Map<string, IdeasPresentationResponse>>>(
    new Map<string, Map<string, IdeasPresentationResponse>>()
  );
  standaloneResponses = signal<Map<string, IdeasPresentationResponse>>(
    new Map<string, IdeasPresentationResponse>()
  );

  studentNamesDisplay = signal<StudentNamesDisplayMode>('hide');
  showComponentPrompt = signal<boolean>(true);
  prompt = signal<string | null>(null);

  // Computed signals
  selectedCount = computed(() => this.selectedIds().size);
  hasSelections = computed(() => {
    if (this.itemType() === 'Ideas') {
      return this.selectedIdeaIds().size > 0 || this.standaloneResponses().size > 0;
    }
    return this.selectedCount() > 0;
  });

  constructor() {
    this.saveSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.persistConfig();
    });
  }

  init(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    componentType: string,
    itemType: TeacherPresentationItemType
  ): void {
    this.runId.set(runId);
    this.periodId.set(periodId);
    this.nodeId.set(nodeId);
    this.componentId.set(componentId);
    this.componentType.set(componentType);
    this.itemType.set(itemType);

    if (runId && periodId && periodId !== -1 && nodeId && componentId) {
      this.configService.getConfig(runId, periodId, nodeId, componentId)?.subscribe({
        next: (config) => {
          if (config && config.id != null) {
            if (this.itemType() === 'Ideas') {
              if (config.itemType === 'Ideas') {
                const ideaIds = new Set<string>();
                const respMap = new Map<string, Map<string, IdeasPresentationResponse>>();
                const standalone = new Map<string, IdeasPresentationResponse>();
                config.items?.forEach((item: any) => {
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
            } else {
              if (config.itemType === 'Discussion' || !config.itemType) {
                const ids = new Set<number>();
                if (config.items) {
                  config.items.forEach((item: any) => {
                    if (item.studentWorkId != null) {
                      ids.add(item.studentWorkId);
                    }
                  });
                }
                this.selectedIds.set(ids);
              }
            }
            this.studentNamesDisplay.set(config.studentNamesDisplay || 'hide');
            this.showComponentPrompt.set(config.showComponentPrompt ?? true);
            this.prompt.set(config.prompt ?? null);
          }
        },
        error: (err) => {
          console.error('Failed to load presentation config', err);
        }
      });
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  select(id: number): void {
    const current = new Set(this.selectedIds());
    if (!current.has(id)) {
      current.add(id);
      this.selectedIds.set(current);
      this.triggerAutosave();
    }
  }

  deselect(id: number): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
      this.selectedIds.set(current);
      this.triggerAutosave();
    }
  }

  toggle(id: number): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
    this.triggerAutosave();
  }

  selectMultiple(ids: number[]): void {
    const current = new Set(this.selectedIds());
    let changed = false;
    for (const id of ids) {
      if (!current.has(id)) {
        current.add(id);
        changed = true;
      }
    }
    if (changed) {
      this.selectedIds.set(current);
      this.triggerAutosave();
    }
  }

  deselectMultiple(ids: number[]): void {
    const current = new Set(this.selectedIds());
    let changed = false;
    for (const id of ids) {
      if (current.has(id)) {
        current.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.selectedIds.set(current);
      this.triggerAutosave();
    }
  }

  setSelections(ids: Set<number> | number[]): void {
    this.selectedIds.set(new Set(ids));
    this.triggerAutosave();
  }

  clearSelections(): void {
    let changed = false;
    if (this.selectedIds().size > 0) {
      this.selectedIds.set(new Set<number>());
      changed = true;
    }
    if (this.selectedIdeaIds().size > 0 || this.standaloneResponses().size > 0) {
      this.selectedIdeaIds.set(new Set<string>());
      this.selectedIdeaResponseMap.set(new Map<string, Map<string, IdeasPresentationResponse>>());
      this.standaloneResponses.set(new Map<string, IdeasPresentationResponse>());
      changed = true;
    }
    if (changed) {
      this.triggerAutosave();
    }
  }

  // Ideas methods
  isIdeaSelected(ideaId: string): boolean {
    return this.selectedIdeaIds().has(ideaId);
  }

  isIdeaResponseSelected(ideaId: string, response: IdeasPresentationResponse): boolean {
    const key = getIdeasResponseKey(response);
    if (this.selectedIdeaResponseMap().get(ideaId)?.has(key)) {
      return true;
    }
    return !this.selectedIdeaIds().has(ideaId) && this.standaloneResponses().has(key);
  }

  toggleIdea(ideaId: string, candidates?: IdeasPresentationResponse[]): void {
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
        if (standalone) {
          ideaResponses.set(key, standalone);
          currentStandalone.delete(key);
        }
      });
      ideaResponses.forEach((_, key) => currentStandalone.delete(key));
      currentMap.set(ideaId, ideaResponses);
    }
    this.selectedIdeaIds.set(currentIdeas);
    this.selectedIdeaResponseMap.set(currentMap);
    this.standaloneResponses.set(currentStandalone);
    this.triggerAutosave();
  }

  toggleIdeaResponse(ideaId: string, response: IdeasPresentationResponse): void {
    const key = getIdeasResponseKey(response);
    const currentIdeas = new Set(this.selectedIdeaIds());
    const currentMap = new Map(this.selectedIdeaResponseMap());
    const currentStandalone = new Map(this.standaloneResponses());

    const ideaResponses = new Map(currentMap.get(ideaId) ?? []);
    const isSelected = ideaResponses.has(key) || currentStandalone.has(key);

    if (isSelected) {
      ideaResponses.delete(key);
      currentStandalone.delete(key);
      currentMap.set(ideaId, ideaResponses);
      // Category remains selected per requirements
    } else {
      ideaResponses.set(key, response);
      currentMap.set(ideaId, ideaResponses);
      // Auto-check parent category
      currentIdeas.add(ideaId);
      currentStandalone.delete(key);
    }

    this.selectedIdeaIds.set(currentIdeas);
    this.selectedIdeaResponseMap.set(currentMap);
    this.standaloneResponses.set(currentStandalone);
    this.triggerAutosave();
  }

  setStudentNamesDisplay(mode: StudentNamesDisplayMode): void {
    this.studentNamesDisplay.set(mode);
    this.triggerAutosave();
  }

  setShowComponentPrompt(show: boolean): void {
    this.showComponentPrompt.set(show);
    this.triggerAutosave();
  }

  setPrompt(newPrompt: string | null): void {
    this.prompt.set(newPrompt);
    this.persistConfig();
  }

  private triggerAutosave(): void {
    this.saveSubject.next();
  }

  private persistConfig(): void {
    const rId = this.runId();
    const pId = this.periodId();
    if (!rId || !pId || pId === -1) return;

    let items: TeacherPresentationItem[];
    if (this.itemType() === 'Ideas') {
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
      items = ideasItems;
    } else {
      items = Array.from(this.selectedIds()).map((id) => ({
        studentWorkId: id
      }));
    }

    const payload: Partial<TeacherPresentationConfig> = {
      runId: rId,
      periodId: pId,
      nodeId: this.nodeId(),
      componentId: this.componentId(),
      componentType: this.componentType(),
      itemType: this.itemType(),
      items,
      studentNamesDisplay: this.studentNamesDisplay(),
      showComponentPrompt: this.showComponentPrompt(),
      prompt: this.prompt()
    };

    this.configService.saveConfig(payload).subscribe({
      error: (err) => console.error('Failed to persist presentation config', err)
    });
  }
}
