import { Component, Input } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { DetectedIdeasComponent } from '../detected-ideas/detected-ideas.component';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from '../dialog-response/dialog-response.component';
import { MatIconModule } from '@angular/material/icon';
import { ShowCRaterRubricComponent } from '../../../../../app/classroom-monitor/show-crater-rubric/show-crater-rubric.component';

@Component({
  imports: [
    DetectedIdeasComponent,
    DialogResponseComponent,
    MatIconModule,
    ShowCRaterRubricComponent
  ],
  selector: 'dialog-responses',
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
