import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-connected-component-default-selects',
  templateUrl: './edit-connected-component-default-selects.component.html',
  styleUrls: ['./edit-connected-component-default-selects.component.scss']
})
export class EditConnectedComponentDefaultSelectsComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  connectedComponent: any;

  @Input()
  allowedConnectedComponentTypes: string[];

  @Output()
  connectedComponentNodeIdChange: EventEmitter<any> = new EventEmitter();

  @Output()
  connectedComponentComponentIdChange: EventEmitter<any> = new EventEmitter();

  @Output()
  connectedComponentTypeChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  connectedComponentNodeIdChanged() {
    this.connectedComponentNodeIdChange.emit(this.connectedComponent);
  }

  connectedComponentComponentIdChanged() {
    this.connectedComponentComponentIdChange.emit(this.connectedComponent);
  }

  connectedComponentTypeChanged() {
    this.connectedComponentTypeChange.emit(this.connectedComponent);
  }
}
