import { Component, inject } from '@angular/core';
import { AbstractExportComponent } from '../abstract-export.component';
import { OneWorkgroupPerRowDataExportStrategy } from '../strategies/OneWorkgroupPerRowDataExportStrategy';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectStepAndComponentCheckboxesComponent } from '../select-step-and-component-checkboxes/select-step-and-component-checkboxes.component';

@Component({
  imports: [
    MatButton,
    MatTooltip,
    MatIcon,
    MatCheckbox,
    FormsModule,
    SelectStepAndComponentCheckboxesComponent
  ],
  styleUrl: './export-one-workgroup-per-row.component.scss',
  templateUrl: './export-one-workgroup-per-row.component.html'
})
export class ExportOneWorkgroupPerRowComponent extends AbstractExportComponent {
  public componentServiceLookupService = inject(ComponentServiceLookupService);

  protected includeBranchPathTaken: boolean;
  protected includeBranchPathTakenNodeId: boolean;
  protected includeBranchPathTakenStepTitle: boolean;
  protected includeComments: boolean;
  protected includeCommentTimestamps: boolean;
  protected includeScores: boolean;
  protected includeScoreTimestamps: boolean;
  protected includeStudentNames: boolean;
  protected includeStudentWork: boolean;
  protected includeStudentWorkIds: boolean;
  protected includeStudentWorkTimestamps: boolean;

  protected export(): void {
    this.showDownloadingExportMessage();
    const strategy = new OneWorkgroupPerRowDataExportStrategy();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }
}
