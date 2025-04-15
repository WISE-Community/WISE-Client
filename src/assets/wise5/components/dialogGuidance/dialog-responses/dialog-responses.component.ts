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
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
  imports: [
    CommonModule,
    CRaterRubricComponent,
    DetectedIdeasComponent,
    DialogResponseComponent,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
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

  constructor(protected dialog: MatDialog) {}

  protected openIdeasRubric() {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.closeAll();
    } else {
      this.dialog.open(CRaterRubricComponent, {
        width: '40%',
        position: { right: '0px', bottom: '0px' },
        hasBackdrop: false,
        data: {
          cRaterRubric: this.cRaterRubric
        }
      });
    }
  }
}
