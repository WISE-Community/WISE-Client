import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';

export class EventDataExportStrategy extends AbstractDataExportStrategy {
  export() {
    this.controller.showDownloadingExportMessage();
    this.dataExportService
      .retrieveEventsExport(
        this.controller.includeStudentEvents,
        this.controller.includeTeacherEvents,
        this.controller.includeStudentNames
      )
      .then((events: any[]) => {
        this.generateEventsExport(events);
      });
  }

  private generateEventsExport(events: any[]): void {
    const rows = [];
    const columnNames = this.getEventsColumnNames();
    const columnNameToNumber = this.getColumnNameToNumber(columnNames);
    rows.push(this.createHeaderRow(columnNames));
    let rowCounter = 1;
    if (this.controller.includeStudentEvents) {
      rowCounter = this.addStudentEvents(
        rows,
        rowCounter,
        columnNames,
        columnNameToNumber,
        this.dataExportService
          .getStudentEvents(events)
          .sort(this.sortByFields('workgroupId', 'serverSaveTime'))
      );
    }
    if (this.controller.includeTeacherEvents) {
      rowCounter = this.addTeacherEvents(
        rows,
        rowCounter,
        columnNames,
        columnNameToNumber,
        this.dataExportService
          .getTeacherEvents(events)
          .sort(this.sortByFields('userId', 'serverSaveTime'))
      );
    }
    const fileName = this.configService.getRunId() + '_events.csv';
    this.controller.generateCSVFile(rows, fileName);
    this.controller.hideDownloadingExportMessage();
  }

  private addStudentEvents(
    rows: any[],
    rowCounter: number,
    columnNames: string[],
    columnNameToNumber: any,
    events: any[]
  ): number {
    for (const workgroup of this.configService.getClassmateUserInfosSortedByWorkgroupId()) {
      rowCounter = this.addStudentEventsForWorkgroup(
        workgroup,
        rows,
        rowCounter,
        columnNames,
        columnNameToNumber,
        events
      );
    }
    return rowCounter;
  }

  private addStudentEventsForWorkgroup(
    workgroup: any,
    rows: any[],
    rowCounter: number,
    columnNames: string[],
    columnNameToNumber: any,
    events: any
  ): number {
    for (const event of events) {
      if (event.workgroupId === workgroup.workgroupId) {
        rowCounter = this.addStudentEventRow(
          workgroup,
          rows,
          rowCounter,
          columnNames,
          columnNameToNumber,
          event
        );
      }
    }
    return rowCounter;
  }

  private addStudentEventRow(
    workgroup: any,
    rows: any[],
    rowCounter: number,
    columnNames: string[],
    columnNameToNumber: any,
    event: any
  ): number {
    const workgroupId = workgroup.workgroupId;
    const periodName = workgroup.periodName;
    const userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
    const extractedUserIDsAndStudentNames = this.controller.extractUserIDsAndStudentNames(
      userInfo.users
    );
    rows.push(
      this.createStudentEventExportRow(
        columnNames,
        columnNameToNumber,
        rowCounter,
        workgroupId,
        extractedUserIDsAndStudentNames['userId1'],
        extractedUserIDsAndStudentNames['userId2'],
        extractedUserIDsAndStudentNames['userId3'],
        extractedUserIDsAndStudentNames['studentName1'],
        extractedUserIDsAndStudentNames['studentName2'],
        extractedUserIDsAndStudentNames['studentName3'],
        periodName,
        event
      )
    );
    return ++rowCounter;
  }

  /**
   * Create the array that will be used as a row in the events export
   * @param columnNames all the header column name
   * @param columnNameToNumber the mapping from column name to column number
   * @param rowCounter the current row number
   * @param workgroupId the workgroup id
   * @param userId1 the User ID 1
   * @param userId2 the User ID 2
   * @param userId3 the User ID 3
   * @param periodName the period name
   * @param componentEventCount the mapping of component to event count
   * @param event the event
   * @return an array containing the cells in the row
   */
  private createStudentEventExportRow(
    columnNames,
    columnNameToNumber,
    rowCounter,
    workgroupId,
    userId1,
    userId2,
    userId3,
    studentName1,
    studentName2,
    studentName3,
    periodName,
    event
  ) {
    const row = this.createRow(columnNames.length);
    this.setRowCounter(row, columnNameToNumber, rowCounter);
    this.setWorkgroupId(row, columnNameToNumber, workgroupId);
    this.setUserType(row, columnNameToNumber, 'Student');
    this.setStudentIDs(row, columnNameToNumber, userId1, userId2, userId3);
    this.setStudentNames(row, columnNameToNumber, studentName1, studentName2, studentName3);
    this.setPeriodName(row, columnNameToNumber, periodName);
    this.setProjectId(row, columnNameToNumber);
    this.setProjectName(row, columnNameToNumber);
    this.setRunId(row, columnNameToNumber);
    this.setEventId(row, columnNameToNumber, event);
    this.setServerSaveTime(row, columnNameToNumber, event);
    this.setClientSaveTime(row, columnNameToNumber, event);
    this.setNodeId(row, columnNameToNumber, event);
    this.setRowComponentId(row, columnNameToNumber, event);
    this.setTitle(row, columnNameToNumber, event);
    this.setComponentPartNumber(row, columnNameToNumber, event);
    this.setComponentTypeAndPrompt(row, columnNameToNumber, event);
    this.setEventJSON(row, columnNameToNumber, event);
    this.setContext(row, columnNameToNumber, event);
    this.setCategory(row, columnNameToNumber, event);
    this.setEvent(row, columnNameToNumber, event);
    this.setEventData(row, columnNameToNumber, event);
    this.setResponse(row, columnNameToNumber, event);
    return row;
  }

  private addTeacherEvents(
    rows: any[],
    rowCounter: number,
    columnNames: any,
    columnNameToNumber: any,
    events: any[]
  ): number {
    return this.addTeacherEvent(rows, rowCounter, columnNames, columnNameToNumber, events);
  }

  private addTeacherEvent(
    rows: any[],
    rowCounter: number,
    columnNames: any,
    columnNameToNumber: any,
    events: any[]
  ): number {
    for (const event of events) {
      const row = this.createTeacherEventExportRow(
        columnNames,
        columnNameToNumber,
        rowCounter,
        event.workgroupId,
        event.userId,
        this.configService.getTeacherUsername(event.userId),
        event
      );
      rows.push(row);
      rowCounter++;
    }
    return rowCounter;
  }

  private getEventsColumnNames() {
    return [
      '#',
      'Workgroup ID',
      'User Type',
      'Student User ID 1',
      'Student Name 1',
      'Student User ID 2',
      'Student Name 2',
      'Student User ID 3',
      'Student Name 3',
      'Teacher User ID',
      'Teacher Username',
      'Class Period',
      'Project ID',
      'Project Name',
      'Run ID',
      'Start Date',
      'End Date',
      'Event ID',
      'Server Timestamp',
      'Client Timestamp',
      'Node ID',
      'Component ID',
      'Component Part Number',
      'Step Title',
      'Component Type',
      'Component Prompt',
      'JSON',
      'Context',
      'Category',
      'Event',
      'Data'
    ];
  }

  private sortByFields(field1: string, field2: string): any {
    return (object1: any, object2: any): number => {
      if (object1[field1] !== object2[field1]) {
        return object1[field1] - object2[field1];
      } else {
        return object1[field2] - object2[field2];
      }
    };
  }

  private getColumnNameToNumber(columnNames) {
    const columnNameToNumber = {};
    for (let c = 0; c < columnNames.length; c++) {
      columnNameToNumber[columnNames[c]] = c;
    }
    return columnNameToNumber;
  }

  private createHeaderRow(columnNames) {
    const headerRow = [];
    for (const columnName of columnNames) {
      headerRow.push(columnName);
    }
    return headerRow;
  }

  private setStudentIDs(row, columnNameToNumber, userId1, userId2, userId3) {
    if (userId1 != null) {
      row[columnNameToNumber['Student User ID 1']] = userId1;
    }
    if (userId2 != null) {
      row[columnNameToNumber['Student User ID 2']] = userId2;
    }
    if (userId3 != null) {
      row[columnNameToNumber['Student User ID 3']] = userId3;
    }
  }

  private setStudentNames(row, columnNameToNumber, studentName1, studentName2, studentName3) {
    if (studentName1 != null && this.controller.includeNames) {
      row[columnNameToNumber['Student Name 1']] = studentName1;
    }
    if (studentName2 != null && this.controller.includeNames) {
      row[columnNameToNumber['Student Name 2']] = studentName2;
    }
    if (studentName3 != null && this.controller.includeNames) {
      row[columnNameToNumber['Student Name 3']] = studentName3;
    }
  }

  private createTeacherEventExportRow(
    columnNames,
    columnNameToNumber,
    rowCounter,
    workgroupId,
    userId,
    username,
    event
  ) {
    const row = this.createRow(columnNames.length);
    this.setRowCounter(row, columnNameToNumber, rowCounter);
    this.setWorkgroupId(row, columnNameToNumber, workgroupId);
    this.setUserType(row, columnNameToNumber, 'Teacher');
    this.setTeacherUserId(row, columnNameToNumber, userId);
    this.setTeacherUsername(row, columnNameToNumber, username);
    this.setProjectId(row, columnNameToNumber);
    this.setProjectName(row, columnNameToNumber);
    this.setRunId(row, columnNameToNumber);
    this.setEventId(row, columnNameToNumber, event);
    this.setServerSaveTime(row, columnNameToNumber, event);
    this.setClientSaveTime(row, columnNameToNumber, event);
    this.setEventJSON(row, columnNameToNumber, event);
    this.setContext(row, columnNameToNumber, event);
    this.setCategory(row, columnNameToNumber, event);
    this.setEvent(row, columnNameToNumber, event);
    this.setEventData(row, columnNameToNumber, event);
    this.setResponse(row, columnNameToNumber, event);
    return row;
  }

  private createRow(length) {
    const row = new Array(length);
    row.fill('');
    return row;
  }

  private setWorkgroupId(row, columnNameToNumber, workgroupId) {
    row[columnNameToNumber['Workgroup ID']] = workgroupId;
  }

  private setEventData(row, columnNameToNumber, data) {
    row[columnNameToNumber['Data']] = data.data;
  }

  private setUserType(row, columnNameToNumber, userType) {
    row[columnNameToNumber['User Type']] = userType;
  }

  private setPeriodName(row, columnNameToNumber, periodName) {
    row[columnNameToNumber['Class Period']] = periodName;
  }

  private setTeacherUserId(row, columnNameToNumber, userId) {
    row[columnNameToNumber['Teacher User ID']] = userId;
  }

  private setTeacherUsername(row, columnNameToNumber, username) {
    if (this.controller.includeNames) {
      row[columnNameToNumber['Teacher Username']] = username;
    }
  }

  private setProjectId(row, columnNameToNumber) {
    row[columnNameToNumber['Project ID']] = this.configService.getProjectId();
  }

  private setProjectName(row, columnNameToNumber) {
    row[columnNameToNumber['Project Name']] = this.projectService.getProjectTitle();
  }

  private setRunId(row, columnNameToNumber) {
    row[columnNameToNumber['Run ID']] = this.configService.getRunId();
  }

  private setEventId(row, columnNameToNumber, data) {
    row[columnNameToNumber['Event ID']] = data.id;
  }

  private setRowCounter(row, columnNameToNumber, rowCounter) {
    row[columnNameToNumber['#']] = rowCounter;
  }

  private setResponse(row, columnNameToNumber, data) {
    const response = this.getEventResponse(event);
    row[columnNameToNumber['Response']] = response;
  }

  private setServerSaveTime(row, columnNameToNumber, data) {
    row[
      columnNameToNumber['Server Timestamp']
    ] = this.utilService.convertMillisecondsToFormattedDateTime(data.serverSaveTime);
  }

  private setClientSaveTime(row, columnNameToNumber, data) {
    row[
      columnNameToNumber['Client Timestamp']
    ] = this.utilService.convertMillisecondsToFormattedDateTime(data.clientSaveTime);
  }

  private setNodeId(row, columnNameToNumber, data) {
    if (data.nodeId != null) {
      row[columnNameToNumber['Node ID']] = data.nodeId;
    }
  }

  private setRowComponentId(row, columnNameToNumber, data) {
    if (data.componentId != null) {
      row[columnNameToNumber['Component ID']] = data.componentId;
    }
  }

  private setEventJSON(row, columnNameToNumber, data) {
    row[columnNameToNumber['JSON']] = data;
  }

  private setContext(row, columnNameToNumber, data) {
    if (data.context != null) {
      row[columnNameToNumber['Context']] = data.context;
    }
  }

  private setCategory(row, columnNameToNumber, data) {
    if (data.category != null) {
      row[columnNameToNumber['Category']] = data.category;
    }
  }

  private setEvent(row, columnNameToNumber, data) {
    if (data.event != null) {
      row[columnNameToNumber['Event']] = data.event;
    }
  }

  private setTitle(row, columnNameToNumber, data) {
    const stepTitle = this.projectService.getNodePositionAndTitle(data.nodeId);
    if (stepTitle != null) {
      row[columnNameToNumber['Step Title']] = stepTitle;
    }
  }

  private setComponentPartNumber(row, columnNameToNumber, data) {
    const componentPartNumber = this.projectService.getComponentPosition(
      data.nodeId,
      data.componentId
    );
    if (componentPartNumber != -1) {
      row[columnNameToNumber['Component Part Number']] = componentPartNumber + 1;
    }
  }

  private setComponentType(row, columnNameToNumber, component) {
    if (component != null) {
      row[columnNameToNumber['Component Type']] = component.type;
    }
  }

  private setComponentPrompt(row, columnNameToNumber, component) {
    if (component != null) {
      let prompt = this.utilService.removeHTMLTags(component.prompt);
      prompt = prompt.replace(/"/g, '""');
      row[columnNameToNumber['Component Prompt']] = prompt;
    }
  }

  private setComponentTypeAndPrompt(row, columnNameToNumber, data) {
    const nodeId = data.nodeId;
    const componentId = data.componentId;
    if (nodeId != null && componentId != null) {
      const component = this.projectService.getComponent(data.nodeId, data.componentId);
      this.setComponentType(row, columnNameToNumber, component);
      this.setComponentPrompt(row, columnNameToNumber, component);
    }
  }

  /**
   * Get the pretty printed representation of the event
   * @param event the event JSON object
   * @return the pretty printed representation of the event
   */
  private getEventResponse(event) {
    var response = ' ';
    if (event != null) {
      if (event.event == 'branchPathTaken') {
        /*
         * this is a branch path taken event so we will show the title
         * of the first step in the branch path that was taken
         */
        if (event.data != null && event.data.toNodeId != null) {
          var toNodeId = event.data.toNodeId;
          var stepTitle = this.projectService.getNodePositionAndTitle(toNodeId);
          response = stepTitle;
        }
      }
    }
    return response;
  }
}
