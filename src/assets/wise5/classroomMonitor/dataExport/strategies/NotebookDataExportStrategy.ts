import { removeHTMLTags } from '../../../common/string/string';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';

export class NotebookDataExportStrategy extends AbstractDataExportStrategy {
  constructor(private exportType: string) {
    super();
  }

  export() {
    this.controller.showDownloadingExportMessage();
    this.dataExportService.retrieveNotebookExport(this.exportType).subscribe((result) => {
      const notebookItems = result;
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
        'Client Save Time',
        'Server Save Time',
        'Workgroup ID',
        'User ID 1',
        'User ID 2',
        'User ID 3',
        'Content',
        'Note Item ID',
        'Type',
        'Response'
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
      for (const notebookItem of notebookItems) {
        const userInfo = this.configService.getUserInfoByWorkgroupId(notebookItem.workgroupId);
        if (userInfo != null) {
          rows.push(
            this.createExportNotebookItemRow(columnNames, columnNameToNumber, notebookItem)
          );
        }
      }
      const runId = this.configService.getRunId();
      let fileName = '';
      if (this.exportType === 'latestNotebookItems') {
        fileName = `${runId}_latest_notebook_items.csv`;
      } else if (this.exportType === 'allNotebookItems') {
        fileName = `${runId}_all_notebook_items.csv`;
      }
      this.controller.generateCSVFile(rows, fileName);
      this.controller.hideDownloadingExportMessage();
    });
  }

  private createExportNotebookItemRow(columnNames, columnNameToNumber, notebookItem) {
    const row = new Array(columnNames.length);
    row.fill(' ');
    row[columnNameToNumber['ID']] = notebookItem.id;
    row[columnNameToNumber['Note Item ID']] = notebookItem.localNotebookItemId;
    row[columnNameToNumber['Node ID']] = notebookItem.nodeId;
    row[columnNameToNumber['Component ID']] = notebookItem.componentId;
    const component = this.projectService.getComponent(
      notebookItem.nodeId,
      notebookItem.componentId
    );
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
    }
    row[columnNameToNumber['Step Number']] = this.controller.getNodePositionById(
      notebookItem.nodeId
    );
    row[columnNameToNumber['Step Title']] = this.controller.getNodeTitleByNodeId(
      notebookItem.nodeId
    );
    const position = this.projectService.getComponentPosition(
      notebookItem.nodeId,
      notebookItem.componentId
    );
    if (position != -1) {
      row[columnNameToNumber['Component Part Number']] = position + 1;
    }
    row[columnNameToNumber['Client Save Time']] = millisecondsToDateTime(
      notebookItem.clientSaveTime
    );
    row[columnNameToNumber['Server Save Time']] = millisecondsToDateTime(
      notebookItem.serverSaveTime
    );
    row[columnNameToNumber['Type']] = notebookItem.type;
    row[columnNameToNumber['Content']] = JSON.parse(notebookItem.content);
    row[columnNameToNumber['Run ID']] = notebookItem.runId;
    row[columnNameToNumber['Workgroup ID']] = notebookItem.workgroupId;
    const userInfo = this.configService.getUserInfoByWorkgroupId(notebookItem.workgroupId);
    if (notebookItem.localNotebookItemId !== 'teacherReport') {
      row[columnNameToNumber['Period ID']] = notebookItem.periodId;
      row[columnNameToNumber['Period Name']] = userInfo.periodName;
    }
    row[columnNameToNumber['Teacher Username']] = this.configService.getTeacherUserInfo().username;
    row[columnNameToNumber['Project ID']] = this.configService.getProjectId();
    if (notebookItem.localNotebookItemId !== 'teacherReport') {
      const student1 = userInfo.users[0];
      const student2 = userInfo.users[1];
      const student3 = userInfo.users[2];
      if (student1 != null) {
        row[columnNameToNumber['User ID 1']] = student1.id;
      }
      if (student2 != null) {
        row[columnNameToNumber['User ID 2']] = student2.id;
      }
      if (student3 != null) {
        row[columnNameToNumber['User ID 3']] = student3.id;
      }
    }
    const responseJSON = JSON.parse(notebookItem.content);
    if (notebookItem.type === 'report') {
      row[columnNameToNumber['Response']] = removeHTMLTags(responseJSON.content);
    } else {
      row[columnNameToNumber['Response']] = responseJSON.text;
    }
    return row;
  }
}
