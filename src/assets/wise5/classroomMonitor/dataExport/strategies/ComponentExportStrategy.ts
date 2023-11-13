import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export abstract class ComponentDataExportStrategy extends AbstractDataExportStrategy {
  constructor(protected nodeId: string, protected component: any) {
    super();
  }

  export(): void {
    this.controller.showDownloadingExportMessage();
    const components = [{ nodeId: this.nodeId, componentId: this.component.id }];
    this.dataExportService.retrieveStudentData(components, true, false, true).subscribe(() => {
      const columnNameToNumber = {};
      const headerRow = this.generateComponentHeaderRow(this.component, columnNameToNumber);
      let rows = [headerRow];
      rows = rows.concat(
        this.generateComponentWorkRows(this.component, headerRow, columnNameToNumber, this.nodeId)
      );
      const fileName = super.generateExportFileName(
        this.nodeId,
        this.component.id,
        this.getComponentTypeWithUnderscore()
      );
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  protected abstract generateComponentHeaderRow(component: any, columnNameToNumber: any): string[];

  protected abstract generateComponentWorkRows(
    component: any,
    columnNames: string[],
    columnNameToNumber: any,
    nodeId: string
  ): string[];

  protected setStudentInfo(row: any[], columnNameToNumber: any, componentState: any): void {
    this.setColumnValue(row, columnNameToNumber, 'Workgroup ID', componentState.workgroupId);
    const userInfo = this.configService.getUserInfoByWorkgroupId(componentState.workgroupId);
    if (userInfo != null) {
      for (let u = 0; u < userInfo.users.length; u++) {
        const user = userInfo.users[u];
        this.setColumnValue(row, columnNameToNumber, `User ID ${u + 1}`, user.id);
        this.setColumnValue(row, columnNameToNumber, `Student Name ${u + 1}`, user.name);
      }
    }
  }

  protected abstract getComponentTypeWithUnderscore(): string;
}
