import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FlexLayoutModule, FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-score',
  standalone: true,
  templateUrl: 'edit-component-score.component.html'
})
export class EditComponentScoreComponent {
  @Input() componentId: string;
  @Input() componentStateId: string;
  @Input() disabled: boolean;
  @Input() fromWorkgroupId: number;
  protected isAutoScore: boolean;
  @Input() latestAnnotationScore: any;
  @Input() nodeId: string;
  @Input() periodId: string;
  @Input() runId: string;
  score: number;
  protected scoreChanged: Subject<number> = new Subject<number>();
  @ViewChild('scoreInput') scoreInputElement: ElementRef;
  private subscriptions: Subscription = new Subscription();
  @Input() toWorkgroupId: number;

  constructor(
    private annotationService: AnnotationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAutoScore = this.latestAnnotationScore?.type === 'autoScore';
    this.score = this.latestAnnotationScore?.data.value ?? 0;
    this.subscriptions.add(
      this.scoreChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((newScore) => {
        this.notificationService.showSavingMessage();
        this.saveScore(newScore);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveScore(score: number): void {
    const annotation = this.annotationService.createAnnotation(
      null,
      this.runId,
      this.periodId,
      this.fromWorkgroupId,
      this.toWorkgroupId,
      this.nodeId,
      this.componentId,
      this.componentStateId,
      null,
      null,
      'score',
      { value: score },
      new Date().getTime()
    );
    this.annotationService.saveAnnotation(annotation).then(() => {
      this.notificationService.showSavedMessage($localize`Saved score`);
    });
  }

  protected focusScoreInput(): void {
    this.scoreInputElement.nativeElement.focus();
  }
}
