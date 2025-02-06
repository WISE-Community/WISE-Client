import { Component, Input } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from '../dialog-response/dialog-response.component';
import { CommonModule } from '@angular/common';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { DetectedIdeasComponent } from '../detected-ideas/detected-ideas.component';

@Component({
  imports: [CommonModule, DetectedIdeasComponent, DialogResponseComponent],
  selector: 'dialog-responses',
  standalone: true,
  styleUrl: './dialog-responses.component.scss',
  templateUrl: './dialog-responses.component.html'
})
export class DialogResponsesComponent {
  @Input() computerAvatar: ComputerAvatar;
  @Input() cRaterRubric: CRaterRubric;
  @Input() isWaitingForComputerResponse: boolean;
  @Input() responses: DialogResponse[] = [];
  @Input() showDetectedIdeas: boolean = false;
}
