import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';

@Component({
  selector: 'edit-component-score',
  templateUrl: 'edit-component-score.component.html'
})
export class EditComponentScoreComponent {
  @Input() componentId: string;
  @Input() componentStateId: string;
  @Input() disabled: boolean;
  @Input() fromWorkgroupId: number;
  @Input() latestAnnotationScore: any;
  @Input() nodeId: string;
  @Input() periodId: string;
  @Input() runId: string;
  @Input() toWorkgroupId: number;
  @ViewChild('scoreInput') scoreInputElement: ElementRef;

  isAutoScore: boolean;
  score: number;
  scoreChanged: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();

  constructor(
    private annotationService: AnnotationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isAutoScore = this.latestAnnotationScore?.type === 'autoScore';
    this.score = this.latestAnnotationScore?.data.value ?? 0;
    this.subscriptions.add(
      this.scoreChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((newScore) => {
        this.notificationService.showSavingMessage();
        this.saveScore(newScore);
      })
    );
  }

  ngOnDestroy() {
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
      this.notificationService.showSavedMessage($localize`Saved Score`);
    });
  }

  focusScoreInput() {
    this.scoreInputElement.nativeElement.focus();
  }
}
