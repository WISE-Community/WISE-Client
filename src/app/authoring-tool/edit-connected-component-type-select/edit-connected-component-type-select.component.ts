import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-connected-component-type-select',
  templateUrl: './edit-connected-component-type-select.component.html',
  styleUrls: ['./edit-connected-component-type-select.component.scss']
})
export class EditConnectedComponentTypeSelectComponent implements OnInit {
  @Input()
  connectedComponent: any;

  @Output()
  connectedComponentChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  connectedComponentTypeChanged() {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
