import DataExportController from '../dataExportController';
import { DataExportStrategy } from './DataExportStrategy';

export class StudentAssetDataExportStrategy implements DataExportStrategy {
  constructor(private controller: DataExportController) {}

  export() {
    this.controller.showDownloadingExportMessage();
    this.controller.DataExportService.retrieveStudentAssetsExport().then(() => {
      this.controller.hideDownloadingExportMessage();
    });
  }
}
