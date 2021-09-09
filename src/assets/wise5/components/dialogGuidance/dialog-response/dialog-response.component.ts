import { Component, Input, OnInit } from '@angular/core';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-response',
  templateUrl: './dialog-response.component.html',
  styleUrls: ['./dialog-response.component.scss']
})
export class DialogResponseComponent implements OnInit {
  @Input()
  response: DialogResponse;

  constructor() {}

  ngOnInit(): void {}
}
