import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { AnnotationService } from '../../../services/annotationService';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
  selector: 'component-average-score',
  template: `
    @if (avgScore || avgScore === 0) {
      {{ avgScore }}/{{ component?.maxScore ?? 0 }}
    }
  `
})
export class ComponentAverageScoreComponent {
  protected avgScore: number | '-';
  @Input() component: any;
  @Input() node: Node;
  @Input() periodId: number;

  constructor(private annotationService: AnnotationService) {}

  ngOnChanges(): void {
    if (this.component && this.node) {
      const annotations = this.getLatestScoreAnnotations();
      const totalScore = annotations.reduce((sumSoFar, a) => sumSoFar + a.data.value, 0);
      this.avgScore = totalScore / annotations.length;
    }
  }

  private getLatestScoreAnnotations() {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(this.node.id, this.component.id)
      .filter((annotation) => this.periodId === -1 || annotation.periodId === this.periodId)
      .filter((annotation) => ['score', 'autoScore'].includes(annotation.type))
      .reduceRight((soFar, currentA) => {
        if (!soFar.some((soFarA) => soFarA.toWorkgroupId === currentA.toWorkgroupId)) {
          soFar.push(currentA);
        }
        return soFar;
      }, []);
  }
}
