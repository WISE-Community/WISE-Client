import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  selector: 'preview-component',
  templateUrl: 'preview-component.component.html'
})
export class PreviewComponentComponent implements OnInit {
  @Input() component: WISEComponent;
  @Input() periodId: number;
  @Output() starterStateChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  updateStarterState(starterState: any) {
    this.starterStateChangedEvent.emit(starterState);
  }
}
