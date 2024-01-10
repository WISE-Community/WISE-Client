import { Component } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import ExportController from '../exportController';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'export-step-visits',
  templateUrl: './export-step-visits.component.html',
  styleUrls: ['./export-step-visits.component.scss']
})
export class ExportStepVisitsComponent extends ExportController {
  project: any;
  nodes: any[];
  checkedItems: string[] = [];
  columnNames: string[];
  columnNameToColumnNumber: any = {};
  idToChecked: any = {};
  idToNode: any = {};
  idToStepNumber: any = {};
  idToStepNumberAndTitle: any = {};
  idToUserInfo: any[] = [];
  rowCounter: number = 1;
  workgroupIdNodeIdToVisitCounter: any = {};
  canViewStudentNames: boolean = false;
  includeStudentNames: boolean = false;
  isShowColumnExplanations: boolean = false;
  columnExplanations: any[];
  includeDeletedSteps: boolean = true;
  deletedSteps: any = {};

  constructor(
    private configService: ConfigService,
    private dataExportService: DataExportService,
    private projectService: TeacherProjectService,
    private upgrade: UpgradeModule,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    this.project = this.projectService.project;
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.nodes = nodeOrderOfProject.nodes;
    this.initializeIdToChecked(this.nodes);
    this.initializeIdToNode(this.nodes);
    this.initializeColumnNames();
    this.initializeColumnNameToColumnNumber();
    this.initializeColumnExplanations();
    this.initializeIdToUserInfo();
  }

  private initializeIdToChecked(nodes: any[]): void {
    for (const node of nodes) {
      this.idToChecked[node.node.id] = true;
    }
    this.includeDeletedSteps = true;
  }

  private initializeIdToNode(nodes: any[]): void {
    for (const node of nodes) {
      const nodeId = node.node.id;
      this.idToNode[nodeId] = node;
      this.idToStepNumber[nodeId] = this.projectService.getNodePositionById(nodeId);
      this.idToStepNumberAndTitle[nodeId] = this.projectService.getNodePositionAndTitle(nodeId);
    }
  }

  private initializeWorkgroupIdNodeIdToVisitCounter(nodes: any[]): void {
    const workgroupIds = this.configService.getClassmateWorkgroupIds();
    for (const workgroupId of workgroupIds) {
      for (const node of nodes) {
        const key = this.getWorkgroupIdNodeIdKey(workgroupId, node.node.id);
        this.workgroupIdNodeIdToVisitCounter[key] = 0;
      }
      for (const deletedStepNodeId of Object.keys(this.deletedSteps)) {
        const key = this.getWorkgroupIdNodeIdKey(workgroupId, deletedStepNodeId);
        this.workgroupIdNodeIdToVisitCounter[key] = 0;
      }
    }
  }

  private initializeColumnNames(): void {
    this.columnNames = [
      '#',
      'Workgroup ID',
      'User ID 1',
      'Student Name 1',
      'User ID 2',
      'Student Name 2',
      'User ID 3',
      'Student Name 3',
      'Run ID',
      'Project ID',
      'Project Name',
      'Period ID',
      'Period Name',
      'Start Date',
      'End Date',
      'Node ID',
      'Step Title',
      'Enter Time',
      'Exit Time',
      'Visit Duration (Seconds)',
      'Visit Counter',
      'Revisit Counter',
      'Previous Node ID',
      'Previous Step Title',
      'Node IDs Since Last Visit',
      'Steps Since Last Visit'
    ];
  }

  private initializeColumnExplanations(): void {
    this.columnExplanations = [
      { name: '#', explanation: $localize`The row number.` },
      { name: 'Workgroup ID', explanation: $localize`The ID of the group.` },
      {
        name: 'User ID 1',
        explanation: $localize`The User ID of the first student in the group. This ID follows the student for all runs.`
      },
      {
        name: 'Student Name 1',
        explanation: $localize`The name of the first student. This only shows up if you have permission to view the student names and you enabled the 'Include Student Names' checkbox.`
      },
      {
        name: 'User ID 2',
        explanation: $localize`The UserID of the second student in the group. This ID follows the student for all runs.`
      },
      {
        name: 'Student Name 2',
        explanation: $localize`The name of the second student. This only shows up if you have permission to view the student names and you enabled the 'Include Student Names' checkbox.`
      },
      {
        name: 'User ID 3',
        explanation: $localize`The User ID of the third student in the group. This ID follows the student for all runs.`
      },
      {
        name: 'Student Name 3',
        explanation: $localize`The name of the third student. This only shows up if you have permission to view the student names and you enabled the 'Include Student Names' checkbox.`
      },
      { name: 'Run ID', explanation: $localize`The ID of the run.` },
      { name: 'Project ID', explanation: $localize`The ID of the project.` },
      { name: 'Project Name', explanation: $localize`The name of the project.` },
      { name: 'Period ID', explanation: $localize`The ID of the period that this student is in.` },
      {
        name: 'Period Name',
        explanation: $localize`The period name that this student is in. This name is chosen by the teacher that created the run.`
      },
      { name: 'Start Date', explanation: $localize`The start date of the run.` },
      { name: 'End Date', explanation: $localize`The end date of the run.` },
      {
        name: 'Node ID',
        explanation: $localize`The ID of the step. Each step in a unit has a unique Node ID.`
      },
      { name: 'Step Title', explanation: $localize`The title of the step.` },
      {
        name: 'Enter Time',
        explanation: $localize`The timestamp when the student entered the step.`
      },
      {
        name: 'Exit Time',
        explanation: $localize`The timestamp when the student exited the step. This value can be empty if WISE did not get the chance to save a step exit event. This can happen if the student closes their laptop without signing out of WISE or if they refresh the WISE page.`
      },
      {
        name: 'Visit Duration (Seconds)',
        explanation: $localize`The amount of time the student spent on the step during this visit measured in seconds.`
      },
      {
        name: 'Visit Counter',
        explanation: $localize`The number of times the student has visited this step so far.`
      },
      {
        name: 'Revisit Counter',
        explanation: $localize`The number of times the student has revisited this step so far. This will always be 1 less than the 'Visit Counter' for a given visit.`
      },
      {
        name: 'Previous Node ID',
        explanation: $localize`The Node ID of the step the student was on before visiting this step.`
      },
      {
        name: 'Previous Step Title',
        explanation: $localize`The step title of the step the student was on before visiting this step.`
      },
      {
        name: 'Node IDs Since Last Visit',
        explanation: $localize`A list of Node IDs that contain the steps the student visited before revisiting this step. This cell will only contain values if they revisit a step. For example if the student navigated to node1, then node2, then node3, then node1. For the second visit to node1, the 'Node IDs Since Last Visit' will show node2, node3.`
      },
      {
        name: 'Steps Since Last Visit',
        explanation: $localize`A list of step numbers that contain the steps the student visited before revisiting this step. This cell will only contain values if they revisit a step. For example if the student navigated to 1.1, then 1.2, then 1.3, then 1.1. For the second visit to 1.1, the 'Steps Since Last Visit' will show 1.2, 1.3.`
      }
    ];
  }

  private initializeIdToUserInfo(): void {
    const workgroupIds = this.configService.getClassmateWorkgroupIds();
    for (const workgroupId of workgroupIds) {
      this.idToUserInfo[workgroupId] = this.configService.getUserInfoByWorkgroupId(workgroupId);
    }
  }

  private isActiveWorkgroup(workgroupId: any): boolean {
    return this.idToUserInfo[workgroupId] != null;
  }

  private getHeaderRow(): string[] {
    return this.columnNames;
  }

  private initializeColumnNameToColumnNumber(): void {
    for (let c = 0; c < this.columnNames.length; c++) {
      this.columnNameToColumnNumber[this.columnNames[c]] = c;
    }
  }

  selectAll(): void {
    for (const node of this.nodes) {
      this.idToChecked[node.node.id] = true;
    }
    this.includeDeletedSteps = true;
  }

  deselectAll(): void {
    for (const node of this.nodes) {
      this.idToChecked[node.node.id] = false;
    }
    this.includeDeletedSteps = false;
  }

  nodeChecked(node: any): void {
    if (node.type === 'group') {
      const isGroupChecked = this.idToChecked[node.id];
      for (const childId of node.ids) {
        this.idToChecked[childId] = isGroupChecked;
      }
    }
  }

  goBack(): void {
    this.upgrade.$injector.get('$state').go('root.cm.export');
  }

  export(): void {
    this.rowCounter = 1;
    this.checkedItems = this.getCheckedItems();
    const includeStudentEvents = true;
    const includeTeacherEvents = false;
    this.dataExportService
      .retrieveEventsExport(includeStudentEvents, includeTeacherEvents, this.includeStudentNames)
      .then((events: any) => {
        this.handleExportCallback(events);
      });
  }

  private getCheckedItems(): string[] {
    const checkedItems = [];
    for (const node of this.nodes) {
      if (this.idToChecked[node.node.id]) {
        checkedItems.push(node.node.id);
      }
    }
    return checkedItems;
  }

  private handleExportCallback(events: any[]): void {
    let sortedEvents = this.sortEvents(events);
    this.deletedSteps = this.getDeletedSteps(sortedEvents);
    sortedEvents = this.cleanEvents(sortedEvents);
    this.initializeWorkgroupIdNodeIdToVisitCounter(this.nodes);
    let previousEnteredEvent = null;
    let rows = [];
    for (const event of sortedEvents) {
      if (this.isStepEnteredEvent(event)) {
        if (previousEnteredEvent != null) {
          rows.push(this.createVisit(previousEnteredEvent, null, rows));
        }
        previousEnteredEvent = event;
      } else if (this.isStepExitedEvent(event)) {
        if (previousEnteredEvent != null && this.isMatchingNodeId(previousEnteredEvent, event)) {
          rows.push(this.createVisit(previousEnteredEvent, event, rows));
        }
        previousEnteredEvent = null;
      }
    }
    if (previousEnteredEvent != null) {
      rows.push(this.createVisit(previousEnteredEvent, null, rows));
    }
    rows = this.filterRows(rows);
    rows.unshift(this.getHeaderRow());
    const fileName = `${this.configService.getRunId()}_visits.csv`;
    this.generateCSVFile(rows, fileName);
  }

  private cleanEvents(events: any[]): any[] {
    let cleanedEvents = [];
    cleanedEvents = this.getNodeEnteredAndExitedEvents(events);
    cleanedEvents = this.getEventsWithActiveWorkgroups(cleanedEvents);
    cleanedEvents = this.getEventsThatAreNotErroneous(cleanedEvents);
    return cleanedEvents;
  }

  private getNodeEnteredAndExitedEvents(events: any[]): any[] {
    const cleanedEvents = [];
    for (const event of events) {
      if (this.isStepEnteredEvent(event) || this.isStepExitedEvent(event)) {
        cleanedEvents.push(event);
      }
    }
    return cleanedEvents;
  }

  private getEventsWithActiveWorkgroups(events: any[]): any[] {
    const cleanedEvents = [];
    for (const event of events) {
      if (this.isActiveWorkgroup(event.workgroupId)) {
        cleanedEvents.push(event);
      }
    }
    return cleanedEvents;
  }

  private getEventsThatAreNotErroneous(events: any[]): any[] {
    const cleanedEvents = [];
    events.forEach((event, index) => {
      if (events[index + 1] == null || !this.isErroneousExitedEvent(event, events[index + 1])) {
        cleanedEvents.push(event);
      }
    });
    return cleanedEvents;
  }

  private isErroneousExitedEvent(event: any, nextEvent: any): any {
    return (
      this.isStepExitedEvent(event) &&
      this.isStepExitedEvent(nextEvent) &&
      this.isMatchingNodeId(event, nextEvent)
    );
  }

  private getDeletedSteps(events: any[]): any {
    const deletedSteps = {};
    for (const event of events) {
      const nodeId = event.nodeId;
      if (
        nodeId != null &&
        this.projectService.getNodeById(nodeId) == null &&
        nodeId.startsWith('node')
      ) {
        deletedSteps[event.nodeId] = true;
      }
    }
    return deletedSteps;
  }

  private isDeletedStep(nodeId: string): boolean {
    return this.deletedSteps[nodeId] != null;
  }

  private filterRows(rows: any[]): any[] {
    return rows.filter((row) => {
      const nodeId = this.getCellInRow(row, 'Node ID');
      return (
        this.checkedItems.includes(nodeId) ||
        (this.includeDeletedSteps && this.isDeletedStep(nodeId))
      );
    });
  }

  private sortEvents(events: any[]): any[] {
    return events.sort(this.sortEventsByWorkgroupIdAndClientSaveTime);
  }

  private sortEventsByWorkgroupIdAndClientSaveTime(a: any, b: any): number {
    if (a.workgroupId < b.workgroupId) {
      return -1;
    } else if (a.workgroupId > b.workgroupId) {
      return 1;
    } else {
      if (a.clientSaveTime < b.clientSaveTime) {
        return -1;
      } else if (a.clientSaveTime > b.clientSaveTime) {
        return 1;
      }
    }
  }

  private isStepEnteredEvent(event: any): boolean {
    return event.event === 'nodeEntered' && event.nodeId.startsWith('node');
  }

  private isStepExitedEvent(event: any): boolean {
    return event.event === 'nodeExited' && event.nodeId.startsWith('node');
  }

  private isMatchingNodeId(nodeEnteredEvent: any, nodeExitedEvent: any): boolean {
    return nodeEnteredEvent.nodeId === nodeExitedEvent.nodeId;
  }

  private createVisit(nodeEnteredEvent: any, nodeExitedEvent: any, previousVisits: any[]): any {
    const visit = this.createRowWithEmptyCells();
    const workgroupId = nodeEnteredEvent.workgroupId;
    const nodeId = nodeEnteredEvent.nodeId;
    this.incrementVisitCounter(workgroupId, nodeId);
    this.setCellInRow(visit, '#', this.getNextRowNumber());
    this.setCellInRow(visit, 'Workgroup ID', workgroupId);
    this.addUserCells(visit, workgroupId);
    this.setCellInRow(visit, 'Project ID', this.configService.getProjectId());
    this.setCellInRow(visit, 'Run ID', this.configService.getRunId());
    this.setCellInRow(visit, 'Project Name', this.configService.getRunName());
    this.setCellInRow(visit, 'Period ID', this.getPeriodId(workgroupId));
    this.setCellInRow(visit, 'Period Name', this.getPeriodName(workgroupId));
    this.setCellInRow(visit, 'Start Date', this.configService.getFormattedStartDate());
    this.setCellInRow(visit, 'End Date', this.configService.getFormattedEndDate());
    this.setCellInRow(visit, 'Node ID', nodeId);
    this.setCellInRow(visit, 'Step Title', this.getStepNumberAndTitle(nodeId));
    this.setCellInRow(
      visit,
      'Enter Time',
      this.utilService.convertMillisecondsToFormattedDateTime(nodeEnteredEvent.clientSaveTime)
    );
    if (nodeExitedEvent == null) {
      this.setCellInRow(visit, 'Exit Time', '(Unknown Exit Time)');
      this.setCellInRow(visit, 'Visit Duration (Seconds)', '(Unknown Visit Duration)');
    } else if (nodeExitedEvent != null) {
      this.setCellInRow(
        visit,
        'Exit Time',
        this.utilService.convertMillisecondsToFormattedDateTime(nodeExitedEvent.clientSaveTime)
      );
      this.setCellInRow(
        visit,
        'Visit Duration (Seconds)',
        this.getVisitDuration(nodeEnteredEvent, nodeExitedEvent)
      );
    }
    this.setCellInRow(visit, 'Visit Counter', this.getVisitCounter(workgroupId, nodeId));
    const revisitCounter = this.getRevisitCounter(workgroupId, nodeId);
    this.setCellInRow(visit, 'Revisit Counter', revisitCounter);
    const previousVisit = this.getPreviousVisit(previousVisits, workgroupId);
    if (previousVisit != null) {
      this.setCellInRow(visit, 'Previous Node ID', this.getCellInRow(previousVisit, 'Node ID'));
      this.setCellInRow(
        visit,
        'Previous Step Title',
        this.getCellInRow(previousVisit, 'Step Title')
      );
    }
    if (revisitCounter > 0) {
      this.setCellInRow(
        visit,
        'Node IDs Since Last Visit',
        this.getNodeIdsBetweenLastVisit(nodeId, previousVisits)
      );
      this.setCellInRow(
        visit,
        'Steps Since Last Visit',
        this.getStepNumbersBetweenLastVisit(nodeId, previousVisits)
      );
    }
    this.incrementRowCounter();
    return visit;
  }

  private createRowWithEmptyCells(): any {
    return new Array(this.columnNames.length);
  }

  private getPreviousVisit(previousVisits: any[], workgroupId: number): any {
    if (previousVisits.length > 0) {
      const previousVisit = previousVisits[previousVisits.length - 1];
      if (this.getCellInRow(previousVisit, 'Workgroup ID') == workgroupId) {
        return previousVisit;
      }
    }
    return null;
  }

  private getNodeIdsBetweenLastVisit(nodeId: string, previousVisits: any[]): string {
    return this.getStepsBetweenLastVisit(nodeId, previousVisits, 'nodeId');
  }

  private getStepNumbersBetweenLastVisit(nodeId: string, previousVisits: any[]): string {
    return this.getStepsBetweenLastVisit(nodeId, previousVisits, 'stepNumber');
  }

  private getStepsBetweenLastVisit(nodeId: string, previousVisits: any[], output: string): string {
    const steps = [];
    for (let v = previousVisits.length - 1; v > 0; v--) {
      const previousNodeId = this.getCellInRow(previousVisits[v], 'Node ID');
      if (previousNodeId === nodeId) {
        break;
      } else {
        if (output === 'nodeId') {
          steps.unshift(previousNodeId);
        } else if (output === 'stepNumber') {
          steps.unshift(this.getStepNumber(previousNodeId));
        }
      }
    }
    return steps.join(', ');
  }

  private addUserCells(row: any[], workgroupId: number): void {
    const userInfo = this.configService.getUserInfoByWorkgroupId(workgroupId);
    for (let u = 0; u < userInfo.users.length; u++) {
      this.addSingleUserCells(row, u + 1, userInfo.users[u]);
    }
  }

  private addSingleUserCells(row: any[], studentNumber: number, user: any): void {
    this.setCellInRow(row, `User ID ${studentNumber}`, user.id);
    if (this.includeStudentNames) {
      this.setCellInRow(row, `Student Name ${studentNumber}`, user.name);
    }
  }

  private getPeriodName(workgroupId: number): string {
    return this.configService.getUserInfoByWorkgroupId(workgroupId).periodName;
  }

  private getPeriodId(workgroupId: number): number {
    return this.configService.getUserInfoByWorkgroupId(workgroupId).periodId;
  }

  private getVisitDuration(nodeEnteredEvent: any, nodeExitedEvent: any): number {
    return (nodeExitedEvent.clientSaveTime - nodeEnteredEvent.clientSaveTime) / 1000;
  }

  private getColumnNumber(columnName: string): number {
    return this.columnNameToColumnNumber[columnName];
  }

  private getNextRowNumber(): number {
    return this.rowCounter;
  }

  private incrementRowCounter(): void {
    this.rowCounter++;
  }

  private getStepNumber(nodeId: string): any {
    if (this.isDeletedStep(nodeId)) {
      return '(Deleted Step)';
    } else {
      return this.idToStepNumber[nodeId];
    }
  }

  private getStepNumberAndTitle(nodeId: string): string {
    if (this.isDeletedStep(nodeId)) {
      return '(Deleted Step)';
    } else {
      return this.idToStepNumberAndTitle[nodeId];
    }
  }

  private getWorkgroupIdNodeIdKey(workgroupId: number, nodeId: string): string {
    return `${workgroupId}-${nodeId}`;
  }

  private incrementVisitCounter(workgroupId: number, nodeId: string): void {
    this.workgroupIdNodeIdToVisitCounter[this.getWorkgroupIdNodeIdKey(workgroupId, nodeId)]++;
  }

  private getVisitCounter(workgroupId: number, nodeId: string): number {
    return this.workgroupIdNodeIdToVisitCounter[this.getWorkgroupIdNodeIdKey(workgroupId, nodeId)];
  }

  private getRevisitCounter(workgroupId: number, nodeId: string): number {
    const key = this.getWorkgroupIdNodeIdKey(workgroupId, nodeId);
    return this.workgroupIdNodeIdToVisitCounter[key] - 1;
  }

  private setCellInRow(row: any[], columnName: string, value: any): void {
    row[this.getColumnNumber(columnName)] = value;
  }

  private getCellInRow(row: any[], columnName: string): any {
    return row[this.getColumnNumber(columnName)];
  }

  toggleColumnExplanations(): void {
    this.isShowColumnExplanations = !this.isShowColumnExplanations;
  }

  backToTop(): void {
    window.document.querySelector('.top-content').scrollIntoView();
  }
}
