import { Component, Input } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from '../dialog-response/dialog-response.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, DialogResponseComponent],
  selector: 'dialog-responses',
  standalone: true,
  styleUrl: './dialog-responses.component.scss',
  templateUrl: './dialog-responses.component.html'
})
export class DialogResponsesComponent {
  @Input() computerAvatar: ComputerAvatar;
  @Input() isWaitingForComputerResponse: boolean;
  @Input() responses: DialogResponse[] = [];
}
