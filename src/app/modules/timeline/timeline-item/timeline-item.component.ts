import { Component, Input, Directive, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: 'app-timeline-item-label',
  host: { class: 'timeline-item__label' }
})
export class TimelineItemLabel {}

@Directive({
  selector: 'app-timeline-item-content',
  host: { class: 'timeline-item__content' }
})
export class TimelineItemContent {}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-timeline-item',
  styleUrl: './timeline-item.component.scss',
  template: `<div class="timeline-item" [class.active]="active">
    <ng-content></ng-content>
  </div> `
})
export class TimelineItemComponent {
  @Input() active: boolean;
}
