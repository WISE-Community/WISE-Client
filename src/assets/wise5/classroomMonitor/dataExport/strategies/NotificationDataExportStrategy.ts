import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export class NotificationDataExportStrategy extends AbstractDataExportStrategy {
  export() {
    this.controller.showDownloadingExportMessage();
    this.dataExportService.retrieveNotificationsExport().then((result) => {
      const notifications = result;
      const columnNames = [
        'ID',
        'Teacher Username',
        'Run ID',
        'Period ID',
        'Period Name',
        'Project ID',
        'Node ID',
        'Component ID',
        'Step Number',
        'Step Title',
        'Component Part Number',
        'Component Type',
        'Server Save Time',
        'Time Generated',
        'Time Dismissed',
        'From Workgroup ID',
        'To Workgroup ID',
        'User ID 1',
        'User ID 2',
        'User ID 3',
        'Data',
        'Group ID',
        'Type',
        'Message'
      ];
      const columnNameToNumber = {};
      const headerRow = [];
      for (let c = 0; c < columnNames.length; c++) {
        const columnName = columnNames[c];
        columnNameToNumber[columnName] = c;
        headerRow.push(columnName);
      }
      const rows = [];
      rows.push(headerRow);
      for (const notification of notifications) {
        rows.push(this.createExportNotificationRow(columnNames, columnNameToNumber, notification));
      }
      const runId = this.configService.getRunId();
      const fileName = `${runId}_notifications.csv`;
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  private createExportNotificationRow(columnNames, columnNameToNumber, notification) {
    const row = new Array(columnNames.length);
    row.fill(' ');
    row[columnNameToNumber['ID']] = notification.id;
    row[columnNameToNumber['Node ID']] = notification.nodeId;
    row[columnNameToNumber['Component ID']] = notification.componentId;
    const component = this.projectService.getComponent(
      notification.nodeId,
      notification.componentId
    );
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
    }
    row[columnNameToNumber['Step Number']] = this.controller.getNodePositionById(
      notification.nodeId
    );
    row[columnNameToNumber['Step Title']] = this.controller.getNodeTitleByNodeId(
      notification.nodeId
    );
    const componentPosition = this.projectService.getComponentPosition(
      notification.nodeId,
      notification.componentId
    );
    if (componentPosition != -1) {
      row[columnNameToNumber['Component Part Number']] = componentPosition + 1;
    }
    row[
      columnNameToNumber['Server Save Time']
    ] = this.utilService.convertMillisecondsToFormattedDateTime(notification.serverSaveTime);
    row[
      columnNameToNumber['Time Generated']
    ] = this.utilService.convertMillisecondsToFormattedDateTime(notification.timeGenerated);
    if (notification.timeDismissed != null) {
      row[
        columnNameToNumber['Time Dismissed']
      ] = this.utilService.convertMillisecondsToFormattedDateTime(notification.timeDismissed);
    }
    row[columnNameToNumber['Type']] = notification.type;
    if (notification.groupId != null) {
      row[columnNameToNumber['Group ID']] = notification.groupId;
    }
    row[columnNameToNumber['Message']] = notification.message;
    row[columnNameToNumber['Data']] = notification.data;
    row[columnNameToNumber['Period ID']] = notification.periodId;
    row[columnNameToNumber['Run ID']] = notification.runId;
    row[columnNameToNumber['From Workgroup ID']] = notification.fromWorkgroupId;
    row[columnNameToNumber['To Workgroup ID']] = notification.toWorkgroupId;
    const userInfo = this.configService.getUserInfoByWorkgroupId(notification.toWorkgroupId);
    row[columnNameToNumber['Period Name']] = userInfo.periodName;
    row[columnNameToNumber['Teacher Username']] = this.configService.getTeacherUserInfo().username;
    row[columnNameToNumber['Project ID']] = this.configService.getProjectId();
    if (userInfo.users != null) {
      this.addStudentUserIDsToNotificationRow(row, columnNameToNumber, userInfo);
    }
    return row;
  }

  private addStudentUserIDsToNotificationRow(row: any, columnNameToNumber: any, userInfo: any) {
    for (let i = 0; i <= 2; i++) {
      const student = userInfo.users[i];
      if (student != null) {
        row[columnNameToNumber[`User ID ${i + 1}`]] = student.id;
      }
    }
    return row;
  }
}
