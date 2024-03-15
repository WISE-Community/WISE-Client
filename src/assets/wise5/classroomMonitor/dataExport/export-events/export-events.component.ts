import { Component } from '@angular/core';
import { AbstractExportComponent } from '../abstract-export.component';
import { EventDataExportStrategy } from '../strategies/EventDataExportStrategy';

@Component({
  selector: 'export-events',
  templateUrl: './export-events.component.html',
  styleUrls: ['./export-events.component.scss']
})
export class ExportEventsComponent extends AbstractExportComponent {
  public includeNames: boolean = false;
  public includeStudentEvents: boolean = true;
  public includeTeacherEvents: boolean = true;

  protected export(): void {
    this.showDownloadingExportMessage();
    const strategy = new EventDataExportStrategy();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }
}
