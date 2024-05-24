import { Component, Input, OnInit } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-responses',
  templateUrl: './dialog-responses.component.html',
  styleUrls: ['./dialog-responses.component.scss']
})
export class DialogResponsesComponent implements OnInit {
  @Input()
  computerAvatar: ComputerAvatar;

  @Input()
  responses: DialogResponse[] = [];

  @Input()
  isWaitingForComputerResponse: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
