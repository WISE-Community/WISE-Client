import { Component, Input, OnInit, Directive, ViewEncapsulation } from '@angular/core';

@Directive({
    selector: 'app-timeline-item-label',
    host: { class: 'timeline-item__label' },
    standalone: false
})
export class TimelineItemLabel {}

@Directive({
    selector: 'app-timeline-item-content',
    host: { class: 'timeline-item__content' },
    standalone: false
})
export class TimelineItemContent {}

@Component({
    selector: 'app-timeline-item',
    templateUrl: './timeline-item.component.html',
    styleUrls: ['./timeline-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TimelineItemComponent implements OnInit {
  @Input()
  active: boolean = false;

  constructor() {}

  ngOnInit() {}
}
