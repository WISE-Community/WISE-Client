import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { DataExportContext } from '../DataExportContext';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { StudentWorkDataExportStrategy } from '../strategies/StudentWorkDataExportStrategy';
import { EventDataExportStrategy } from '../strategies/EventDataExportStrategy';
import { NotebookDataExportStrategy } from '../strategies/NotebookDataExportStrategy';
import { NotificationDataExportStrategy } from '../strategies/NotificationDataExportStrategy';
import { StudentAssetDataExportStrategy } from '../strategies/StudentAssetDataExportStrategy';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {
  componentExportTooltips = {};
  componentExportDefaultColumnNames = [
    '#',
    'Workgroup ID',
    'User ID 1',
    'Student Name 1',
    'User ID 2',
    'Student Name 2',
    'User ID 3',
    'Student Name 3',
    'Class Period',
    'Project ID',
    'Project Name',
    'Run ID',
    'Start Date',
    'End Date',
    'Student Work ID',
    'Server Timestamp',
    'Client Timestamp',
    'Node ID',
    'Component ID',
    'Component Part Number',
    'Step Title',
    'Component Type',
    'Component Prompt',
    'Student Data',
    'Component Revision Counter',
    'Is Submit',
    'Submit Count'
  ];
  canViewStudentNames: boolean = false;
  componentTypeToComponentService: any = {};
  dataExportContext: DataExportContext;
  exportStepSelectionType: string = 'exportAllSteps';
  exportType: string = null; // type of export: [latestWork, allWork, events]
  exportTypeLabel: string;
  flattenedProjectAsNodeIds: string[] = [];
  includeAnnotations: boolean;
  includeEvents: boolean;
  includeNames: boolean;
  includeStudentEvents: boolean;
  includeStudentNames: boolean;
  includeTeacherEvents: boolean;
  nodes: any[] = [];
  project: any;
  projectIdToOrder: any;
  projectItems: any;

  constructor(
    public annotationService: AnnotationService,
    public componentServiceLookupService: ComponentServiceLookupService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    private dialog: MatDialog,
    public projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.dataExportContext = new DataExportContext(this);
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.componentExportTooltips[
      'Match'
    ] = $localize`Correctness column key: 0 = Incorrect, 1 = Correct, 2 = Correct bucket but wrong position`;
    this.setDefaultExportSettings();
    this.project = this.projectService.project;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.projectItems = nodeOrderOfProject.nodes;
    this.flattenedProjectAsNodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    this.nodes = Object.values(this.projectIdToOrder);
    this.nodes.sort(this.sortNodesByOrder);
  }

  sortNodesByOrder(nodeA: any, nodeB: any): number {
    return nodeA.order - nodeB.order;
  }

  setExportType(exportType: string): void {
    this.exportType = exportType;
    this.exportTypeLabel = this.getExportTypeLabel(this.exportType);
  }

  getExportTypeLabel(exportType: string): string {
    switch (exportType) {
      case 'latestStudentWork':
        return $localize`Latest Student Work`;
      case 'allStudentWork':
        return $localize`All Student Work`;
      case 'events':
        return $localize`Events`;
      default:
        return null;
    }
  }

  /**
   * Export all or latest work for this run in CSV format
   * latestWork, allWork, and events will call this function with a null exportType.
   */
  export(exportType = this.exportType): void {
    this.dataService.saveEvent(
      'ClassroomMonitor',
      null,
      null,
      null,
      'UserInteraction',
      'exportRequested',
      { exportType: exportType }
    );
    if (exportType === 'allStudentWork' || exportType === 'latestStudentWork') {
      this.dataExportContext.setStrategy(new StudentWorkDataExportStrategy(exportType));
    } else if (exportType === 'events') {
      this.dataExportContext.setStrategy(new EventDataExportStrategy());
    } else if (exportType === 'latestNotebookItems' || exportType === 'allNotebookItems') {
      this.dataExportContext.setStrategy(new NotebookDataExportStrategy(exportType));
    } else if (exportType === 'notifications') {
      this.dataExportContext.setStrategy(new NotificationDataExportStrategy());
    } else if (exportType === 'studentAssets') {
      this.dataExportContext.setStrategy(new StudentAssetDataExportStrategy());
    }
    this.dataExportContext.export();
  }

  /**
   * @param users An array of user objects. Each user object contains an id and name.
   * @returns {object} An object that contains key/value pairs. The key is userIdX
   * or studentNameX where X is an integer. The values are the corresponding actual
   * values of user id and student name.
   */
  extractUserIDsAndStudentNames(users: any[]): any {
    const extractedUserIDsAndStudentNames = {};
    for (let u = 0; u < users.length; u++) {
      let user = users[u];
      extractedUserIDsAndStudentNames['userId' + (u + 1)] = user.id;
      if (this.canViewStudentNames) {
        extractedUserIDsAndStudentNames['studentName' + (u + 1)] = user.name;
      }
    }
    return extractedUserIDsAndStudentNames;
  }

  /**
   * Generate the csv file and have the client download it
   * @param rows a 2D array that represents the rows in the export
   * each row contains an array. the inner array contains strings or
   * numbers which represent the cell values in the export.
   * @param fileName the name of the file that will be generated
   */
  generateCSVFile(rows: any[], fileName: string): void {
    var csvString = '';
    if (rows != null) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        if (row != null) {
          for (var c = 0; c < row.length; c++) {
            var cell = row[c];
            if (cell == null || cell === '' || typeof cell === 'undefined') {
              cell = ' ';
            } else if (typeof cell === 'object') {
              /*
               * the cell value is an object so we will obtain the
               * string representation of the object and wrap it
               * in quotes
               */
              cell = JSON.stringify(cell);
              cell = cell.replace(/"/g, '""');
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = '"' + cell + '"';
            } else if (typeof cell === 'string') {
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = cell.replace(/"/g, '""');
              cell = '"' + cell + '"';
            }
            csvString += cell + ',';
          }
          csvString += '\r\n';
        }
      }
    }
    const csvBlob = new Blob([csvString], { type: 'text/csv; charset=utf-8' });
    FileSaver.saveAs(csvBlob, fileName);
  }

  /**
   * Get the selected nodes to export
   * @return an array of objects that contain a nodeId field and maybe also
   * a componentId field
   * example
   * [
   *   {
   *     nodeId: "node1",
   *     componentId: "343b8aesf7"
   *   },
   *   {
   *     nodeId: "node2",
   *     componentId: "b34gaf0ug2"
   *   },
   *   {
   *     nodeId: "node3"
   *   }
   * ]
   * Note: "node3" means just node3, not components in node2.
   */
  getSelectedNodesToExport(): any[] {
    const selectedNodes = [];
    for (let n = 0; n < this.projectItems.length; n++) {
      let item = this.projectItems[n];
      if (item.node.type === 'node') {
        let nodeId = item.node.id;
        if (item.checked) {
          const selectedStep = {
            nodeId: nodeId
          };
          selectedNodes.push(selectedStep);
        }
        if (item.node.components != null && item.node.components.length > 0) {
          item.node.components.map((component) => {
            if (component.checked) {
              const selectedComponent = {
                nodeId: nodeId,
                componentId: component.id
              };
              selectedNodes.push(selectedComponent);
            }
          });
        }
      }
    }
    return selectedNodes;
  }

  /**
   * Get the node position
   * @param nodeId the node id
   * @returns the node position
   */
  getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  /**
   * Get the node title for a node
   * @param nodeId the node id
   * @returns the node title
   */
  getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  defaultClicked(): void {
    this.setDefaultExportSettings();
  }

  everythingClicked(): void {
    this.includeStudentNames = true;
    this.exportStepSelectionType = 'exportAllSteps';
    this.includeAnnotations = true;
    this.includeEvents = true;
  }

  setDefaultExportSettings(): void {
    if (this.canViewStudentNames) {
      this.includeStudentNames = true;
    } else {
      this.includeStudentNames = false;
    }
    this.exportStepSelectionType = 'exportAllSteps';
    this.includeAnnotations = false;
    this.includeEvents = false;

    /*
     * remove checked fields that may have been accidentally saved by the
     * authoring tool or grading tool
     */
    this.projectService.cleanupBeforeSave();
  }

  showDownloadingExportMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Downloading Export`
      },
      disableClose: false
    });
  }

  hideDownloadingExportMessage(): void {
    this.dialog.closeAll();
  }

  protected exportVisitsClicked(): void {
    this.router.navigate(['visits'], { relativeTo: this.route });
  }

  protected goToExportItemPage(): void {
    this.router.navigate(['item'], { relativeTo: this.route });
  }

  protected goToExportRawDataPage(): void {
    this.router.navigate(['raw'], { relativeTo: this.route });
  }

  protected goToExportEventsPage(): void {
    this.router.navigate(['events'], { relativeTo: this.route });
  }

  protected goToExportOneWorkgroupPerRowPage(): void {
    this.router.navigate(['one-workgroup-per-row'], { relativeTo: this.route });
  }
}
