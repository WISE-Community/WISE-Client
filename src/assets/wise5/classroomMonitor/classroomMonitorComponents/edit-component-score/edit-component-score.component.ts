import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotationService } from '../../../services/annotationService';

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

  constructor(private AnnotationService: AnnotationService) {}

  ngOnInit() {
    this.isAutoScore = this.latestAnnotationScore?.type === 'autoScore';
    this.score = this.latestAnnotationScore?.data.value ?? 0;
    this.subscriptions.add(
      this.scoreChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((newScore) => {
        this.saveScore(newScore);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  saveScore(score: number) {
    const annotation = this.AnnotationService.createAnnotation(
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
    this.AnnotationService.saveAnnotation(annotation);
  }

  focusScoreInput() {
    this.scoreInputElement.nativeElement.focus();
  }
}
