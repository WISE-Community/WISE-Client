import { Component } from '@angular/core';
import { RawDataExportStrategy } from '../strategies/RawDataExportStrategy';
import { AbstractExportComponent } from '../abstract-export.component';
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
  styles: ['.parameters-div { margin-bottom: 20px; } .mat-icon { margin: 0px; }'],
  templateUrl: './export-raw-data.component.html'
})
export class ExportRawDataComponent extends AbstractExportComponent {
  protected includeAnnotations = false;
  protected includeEvents = false;

  protected selectDefault(): void {
    this.includeStudentWork = true;
    this.includeStudentNames = true;
    this.includeAnnotations = false;
    this.includeEvents = false;
  }

  protected selectAll(): void {
    this.includeStudentWork = true;
    this.includeStudentNames = true;
    this.includeAnnotations = true;
    this.includeEvents = true;
  }

  protected export(): void {
    this.showDownloadingExportMessage();
    const strategy = new RawDataExportStrategy();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }
}
