import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MilestoneService } from '../../../services/milestoneService';
import { Node } from '../../../common/Node';
import { MatDialog } from '@angular/material/dialog';
import { MilestoneDetailsDialogComponent } from '../milestones/milestone-details-dialog/milestone-details-dialog.component';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule],
  selector: 'milestone-report-button',
  standalone: true,
  templateUrl: './milestone-report-button.component.html'
})
export class MilestoneReportButtonComponent {
  @Input() component: any;
  @Input() node: Node;
  @Input() periodId: number;
  protected report: any;

  constructor(
    private dialog: MatDialog,
    private milestoneService: MilestoneService
  ) {}

  ngOnChanges(): void {
    if (this.node && this.component) {
      this.setMilestoneReport();
    }
  }

  private setMilestoneReport(): void {
    this.report = this.milestoneService.getMilestoneReport(this.node.id, this.component.id);
  }

  protected showReport(): void {
    this.dialog.open(MilestoneDetailsDialogComponent, {
      data: this.report,
      panelClass: 'dialog-lg'
    });
  }
}
