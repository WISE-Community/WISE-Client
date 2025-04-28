import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { CRaterRubricComponent } from '../../common/cRater/crater-rubric/crater-rubric.component';
import { DetectedIdeasComponent } from '../detected-ideas/detected-ideas.component';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from '../dialog-response/dialog-response.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RubricEventService } from '../../common/cRater/crater-rubric/RubricEventService';

@Component({
  imports: [
    CommonModule,
    CRaterRubricComponent,
    DetectedIdeasComponent,
    DialogResponseComponent,
    MatIconModule
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

  constructor(
    protected dialog: MatDialog,
    protected rubricEventService: RubricEventService
  ) {}

  protected openIdeasRubric(): void {
    if (!this.rubricEventService.getIsRubricOpen()) {
      this.dialog.open(CRaterRubricComponent, {
        panelClass: 'dialog-sm',
        position: { right: '0', bottom: '0' },
        hasBackdrop: false,
        data: this.cRaterRubric,
        autoFocus: false
      });
      this.rubricEventService.rubricToggled();
    }
  }
}
