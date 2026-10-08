import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import {
  StudentNamesDisplayMode,
  TeacherPresentationConfig,
  TeacherPresentationItem,
  TeacherPresentationReflectionAnswer,
  TeacherPresentationReflectionQuestion
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

  selectedIds = signal<Set<number>>(new Set<number>());
  studentNamesDisplay = signal<StudentNamesDisplayMode>('hide');
  prompt = signal<string | null>(null);
  reflectionAnswers = signal<Map<string, TeacherPresentationReflectionAnswer>>(new Map());
  reflectionQuestions = signal<TeacherPresentationReflectionQuestion[]>([]);

  // Computed signals
  selectedCount = computed(() => this.selectedIds().size);
  hasSelections = computed(() => this.selectedCount() > 0);

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
    reflectionQuestions: TeacherPresentationReflectionQuestion[] = []
  ): void {
    this.runId.set(runId);
    this.periodId.set(periodId);
    this.nodeId.set(nodeId);
    this.componentId.set(componentId);
    this.componentType.set(componentType);
    this.reflectionQuestions.set(reflectionQuestions);

    if (runId && periodId && periodId !== -1 && nodeId && componentId) {
      this.configService.getConfig(runId, periodId, nodeId, componentId).subscribe({
        next: (config) => {
          if (config) {
            const ids = new Set<number>();
            if (config.items) {
              config.items.forEach((item) => ids.add(item.studentWorkId));
            }
            this.selectedIds.set(ids);
            this.studentNamesDisplay.set(config.studentNamesDisplay || 'hide');
            this.prompt.set(config.prompt || null);

            const ansMap = new Map<string, TeacherPresentationReflectionAnswer>();
            if (config.answers) {
              config.answers.forEach((ans) => ansMap.set(ans.questionId, ans));
            }
            this.reflectionAnswers.set(ansMap);
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
    if (this.selectedIds().size > 0) {
      this.selectedIds.set(new Set<number>());
      this.triggerAutosave();
    }
  }

  setStudentNamesDisplay(mode: StudentNamesDisplayMode): void {
    this.studentNamesDisplay.set(mode);
    this.triggerAutosave();
  }

  setPrompt(newPrompt: string | null): void {
    this.prompt.set(newPrompt);
    // Prompt save is immediate as specified in implementation plan
    this.persistConfig();
  }

  saveReflectionAnswer(questionId: string, questionText: string, answerText: string): void {
    const rId = this.runId();
    const pId = this.periodId();
    if (!rId || !pId) return;

    this.configService
      .saveAnswer({
        runId: rId,
        periodId: pId,
        nodeId: this.nodeId(),
        componentId: this.componentId(),
        componentType: this.componentType(),
        questionId,
        questionText,
        answerText
      })
      .subscribe({
        next: (savedAnswer) => {
          const map = new Map(this.reflectionAnswers());
          map.set(questionId, savedAnswer);
          this.reflectionAnswers.set(map);
        },
        error: (err) => {
          console.error('Failed to save reflection answer', err);
        }
      });
  }

  private triggerAutosave(): void {
    this.saveSubject.next();
  }

  private persistConfig(): void {
    const rId = this.runId();
    const pId = this.periodId();
    if (!rId || !pId || pId === -1) return;

    const items: TeacherPresentationItem[] = Array.from(this.selectedIds()).map((id) => ({
      studentWorkId: id
    }));

    const payload: Partial<TeacherPresentationConfig> = {
      runId: rId,
      periodId: pId,
      nodeId: this.nodeId(),
      componentId: this.componentId(),
      componentType: this.componentType(),
      items,
      studentNamesDisplay: this.studentNamesDisplay(),
      prompt: this.prompt()
    };

    this.configService.saveConfig(payload).subscribe({
      error: (err) => console.error('Failed to persist presentation config', err)
    });
  }
}
