import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: { class: 'timeline' },
  selector: 'app-timeline',
  styles: [
    `
      .timeline {
        display: block;
        padding: 16px 0;
      }
    `
  ],
  template: '<ng-content></ng-content>'
})
export class TimelineComponent {}
