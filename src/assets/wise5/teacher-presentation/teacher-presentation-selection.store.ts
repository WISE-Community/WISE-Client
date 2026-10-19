import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import {
  IdeasPresentationResponse,
  StudentNamesDisplayMode,
  TeacherPresentationConfig,
  TeacherPresentationItem,
  TeacherPresentationType
} from './teacher-presentation-config';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import { DiscussionSelectionState } from './discussion-selection-state';
import { IdeasSelectionState } from './ideas-selection-state';

@Injectable({
  providedIn: 'root'
})
export class TeacherPresentationSelectionStore implements OnDestroy {
  private configService = inject(TeacherPresentationConfigService);

  private saveSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  readonly runId = signal<number | null>(null);
  readonly periodId = signal<number | null>(null);
  readonly nodeId = signal<string>('');
  readonly componentId = signal<string>('');
  readonly componentType = signal<string>('');
  readonly type = signal<TeacherPresentationType>('Discussion');

  readonly discussion = new DiscussionSelectionState();
  readonly ideas = new IdeasSelectionState();

  get selectedIds() {
    return this.discussion.selectedIds;
  }
  get selectedCount() {
    return this.discussion.selectedCount;
  }

  get selectedIdeaIds() {
    return this.ideas.selectedIdeaIds;
  }
  get selectedIdeaResponseMap() {
    return this.ideas.selectedIdeaResponseMap;
  }
  get standaloneResponses() {
    return this.ideas.standaloneResponses;
  }

  readonly studentNamesDisplay = signal<StudentNamesDisplayMode>('hide');
  readonly showComponentPrompt = signal<boolean>(true);
  readonly prompt = signal<string | null>(null);

  readonly hasSelections = computed(() => {
    return this.type() === 'Ideas' ? this.ideas.hasSelections() : this.discussion.hasSelections();
  });

  constructor() {
    this.saveSubject.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.persistConfig();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init(
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    componentType: string,
    type: TeacherPresentationType
  ): void {
    this.runId.set(runId);
    this.periodId.set(periodId);
    this.nodeId.set(nodeId);
    this.componentId.set(componentId);
    this.componentType.set(componentType);
    this.type.set(type);

    if (runId && periodId && periodId !== -1 && nodeId && componentId) {
      this.configService.getConfig(runId, periodId, nodeId, componentId)?.subscribe({
        next: (config) => {
          if (config && config.id != null) {
            const configType = config.type;
            if (this.type() === 'Ideas') {
              if (configType === 'Ideas') {
                this.ideas.loadFromItems(config.items);
              }
            } else {
              if (configType === 'Discussion' || !configType) {
                this.discussion.loadFromItems(config.items);
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

  // Discussion methods (delegated to discussion sub-state)
  isSelected(id: number): boolean {
    return this.discussion.isSelected(id);
  }

  select(id: number): void {
    if (this.discussion.select(id)) {
      this.triggerAutosave();
    }
  }

  deselect(id: number): void {
    if (this.discussion.deselect(id)) {
      this.triggerAutosave();
    }
  }

  toggle(id: number): void {
    if (this.discussion.toggle(id)) {
      this.triggerAutosave();
    }
  }

  selectMultiple(ids: number[]): void {
    if (this.discussion.selectMultiple(ids)) {
      this.triggerAutosave();
    }
  }

  deselectMultiple(ids: number[]): void {
    if (this.discussion.deselectMultiple(ids)) {
      this.triggerAutosave();
    }
  }

  setSelections(ids: Set<number> | number[]): void {
    if (this.discussion.setSelections(ids)) {
      this.triggerAutosave();
    }
  }

  clearSelections(): void {
    const discussionChanged = this.discussion.clear();
    const ideasChanged = this.ideas.clear();
    if (discussionChanged || ideasChanged) {
      this.triggerAutosave();
    }
  }

  // Ideas methods (delegated to ideas sub-state)
  isIdeaSelected(ideaId: string): boolean {
    return this.ideas.isIdeaSelected(ideaId);
  }

  isIdeaResponseSelected(ideaId: string, response: IdeasPresentationResponse): boolean {
    return this.ideas.isIdeaResponseSelected(ideaId, response);
  }

  toggleIdea(ideaId: string, candidates?: IdeasPresentationResponse[]): void {
    if (this.ideas.toggleIdea(ideaId, candidates)) {
      this.triggerAutosave();
    }
  }

  toggleIdeaResponse(ideaId: string, response: IdeasPresentationResponse): void {
    if (this.ideas.toggleIdeaResponse(ideaId, response)) {
      this.triggerAutosave();
    }
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

    const items: TeacherPresentationItem[] =
      this.type() === 'Ideas' ? this.ideas.toPayloadItems() : this.discussion.toPayloadItems();

    const payload: Partial<TeacherPresentationConfig> = {
      runId: rId,
      periodId: pId,
      nodeId: this.nodeId(),
      componentId: this.componentId(),
      componentType: this.componentType(),
      type: this.type(),
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
