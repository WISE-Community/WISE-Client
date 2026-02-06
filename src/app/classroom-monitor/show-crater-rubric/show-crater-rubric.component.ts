import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CRaterRubric } from '../../../assets/wise5/components/common/cRater/CRaterRubric';
import { CRaterRubricComponent } from '../../../assets/wise5/components/common/cRater/crater-rubric/crater-rubric.component';
import { RubricEventService } from '../../../assets/wise5/components/common/cRater/crater-rubric/RubricEventService';

@Component({
  imports: [MatIconModule],
  selector: 'show-crater-rubric',
  templateUrl: './show-crater-rubric.component.html'
})
export class ShowCRaterRubricComponent {
  @Input() cRaterRubric: CRaterRubric;
  protected hasRubricData: boolean;
  private rubricDialog: MatDialogRef<CRaterRubricComponent>;

  constructor(
    protected dialog: MatDialog,
    protected rubricEventService: RubricEventService
  ) {}

  ngOnInit(): void {
    this.hasRubricData = this.cRaterRubric?.hasRubricData() ?? false;
  }

  ngOnDestroy(): void {
    if (this.rubricEventService.getIsRubricOpen()) {
      this.rubricDialog.close();
    }
  }

  protected openIdeasRubric(): void {
    if (!this.rubricEventService.getIsRubricOpen()) {
      this.rubricDialog = this.dialog.open(CRaterRubricComponent, {
        panelClass: 'dialog-sm',
        position: { right: '0', bottom: '0' },
        hasBackdrop: false,
        data: this.cRaterRubric,
        autoFocus: false
      });
    }
  }
}
