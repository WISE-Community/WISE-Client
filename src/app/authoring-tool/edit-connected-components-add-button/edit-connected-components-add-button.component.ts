import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'edit-connected-components-add-button',
  templateUrl: './edit-connected-components-add-button.component.html',
  styleUrls: ['./edit-connected-components-add-button.component.scss']
})
export class EditConnectedComponentsAddButtonComponent implements OnInit {
  @Output()
  connectedComponentsChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  addConnectedComponent(): void {
    this.connectedComponentsChanged.emit();
  }
}
