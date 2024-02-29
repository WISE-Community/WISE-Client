import { Component } from '@angular/core';
import { RawDataExportStrategy } from '../strategies/RawDataExportStrategy';
import { AbstractExportComponent } from '../abstract-export.component';

@Component({
  selector: 'export-raw-data',
  templateUrl: './export-raw-data.component.html',
  styleUrls: ['./export-raw-data.component.scss']
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
