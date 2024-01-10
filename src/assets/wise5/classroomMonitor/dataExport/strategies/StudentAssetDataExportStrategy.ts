import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export class StudentAssetDataExportStrategy extends AbstractDataExportStrategy {
  export() {
    this.controller.showDownloadingExportMessage();
    this.dataExportService.retrieveStudentAssetsExport().then(() => {
      this.controller.hideDownloadingExportMessage();
    });
  }
}
