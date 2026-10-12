import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfigService } from '../services/configService';
import { TeacherReflectionService } from './teacher-reflection.service';
import { TeacherReflectionQuestion } from '../common/ComponentContent';
import { TeacherReflection } from './teacher-reflection.model';
import { NotificationService } from '../services/notificationService';

interface PendingAnswer {
  question: TeacherReflectionQuestion;
  text: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatExpansionModule, MatFormFieldModule, MatInputModule],
  selector: 'teacher-reflection',
  templateUrl: './teacher-reflection.component.html'
})
export class TeacherReflectionComponent implements OnInit, OnChanges, OnDestroy {
  readonly nodeId = input<string>('');
  readonly componentId = input<string>('');
  readonly componentType = input<string>('');
  readonly periodId = input<number>();
  readonly questions = input<TeacherReflectionQuestion[]>([]);

  private changeDetectorRef = inject(ChangeDetectorRef);
  private configService = inject(ConfigService);
  private notificationService = inject(NotificationService);
  private reflectionService = inject(TeacherReflectionService);

  private answers = signal<Record<string, string>>({});
  private answerChangeSubject = new Subject<PendingAnswer>();
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.answerChangeSubject.pipe(debounceTime(1000)).subscribe(({ question, text }) => {
        this.notificationService.showSavingMessage();
        this.saveAnswer(question, text);
      })
    );
    this.loadAnswers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.periodId && !changes.periodId.firstChange) ||
      (changes.nodeId && !changes.nodeId.firstChange) ||
      (changes.componentId && !changes.componentId.firstChange)
    ) {
      this.loadAnswers();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getAnswerText(questionId: string): string {
    return this.answers()[questionId] ?? '';
  }

  onAnswerChange(question: TeacherReflectionQuestion, text: string): void {
    this.answers.update((answers) => ({ ...answers, [question.id]: text }));
    this.answerChangeSubject.next({ question, text });
  }

  private loadAnswers(): void {
    const runId = this.configService.getRunId();
    const periodId = this.periodId();
    const nodeId = this.nodeId();
    const componentId = this.componentId();
    if (!runId || periodId == null || periodId === -1 || !nodeId || !componentId) {
      return;
    }

    this.reflectionService.getQuestions(runId, periodId, nodeId, componentId).subscribe({
      next: (questions: TeacherReflection[]) => {
        const loadedAnswers: Record<string, string> = {};
        for (const q of questions) {
          if (q.questionId && q.answerText != null) {
            loadedAnswers[q.questionId] = q.answerText;
          }
        }
        this.answers.set(loadedAnswers);
        this.changeDetectorRef.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load teacher reflection answers', err);
      }
    });
  }

  private saveAnswer(question: TeacherReflectionQuestion, answerText: string): void {
    const runId = this.configService.getRunId();
    const periodId = this.periodId();
    const answeredByWorkgroupId = this.configService.getWorkgroupId();
    if (!runId || periodId == null || periodId === -1 || answeredByWorkgroupId == null) {
      return;
    }

    this.reflectionService
      .saveAnswer({
        runId,
        periodId,
        nodeId: this.nodeId(),
        componentId: this.componentId(),
        componentType: this.componentType(),
        questionId: question.id,
        questionText: question.text,
        answerText,
        answeredByWorkgroupId
      })
      .subscribe({
        next: () => {
          this.notificationService.showSavedMessage($localize`Answer saved`);
        },
        error: (err) => {
          console.error('Failed to save teacher reflection answer', err);
        }
      });
  }
}
