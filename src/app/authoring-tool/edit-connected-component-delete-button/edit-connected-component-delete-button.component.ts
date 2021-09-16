import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-connected-component-delete-button',
  templateUrl: './edit-connected-component-delete-button.component.html',
  styleUrls: ['./edit-connected-component-delete-button.component.scss']
})
export class EditConnectedComponentDeleteButtonComponent implements OnInit {
  @Input()
  connectedComponentIndex: number;

  @Output()
  connectedComponentChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  deleteConnectedComponent(index: number) {
    this.connectedComponentChange.emit(index);
  }
}
