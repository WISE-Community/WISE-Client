import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { DataExportService } from '../../services/dataExportService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Directive } from '@angular/core';

@Directive()
export abstract class AbstractExportComponent {
  protected canViewStudentNames = false;
  protected exportStepSelectionType: string = 'exportAllSteps';
  protected flattenedProjectAsNodeIds: string[] = [];
  protected includeStudentNames = true;
  protected includeStudentWork = true;
  protected nodes: any[] = [];
  protected project: any;
  protected projectIdToOrder: any;
  protected projectItems: any;

  constructor(
    public annotationService: AnnotationService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    public dataService: TeacherDataService,
    protected dialog: MatDialog,
    public projectService: TeacherProjectService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.project = this.projectService.project;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.projectItems = nodeOrderOfProject.nodes;
    this.flattenedProjectAsNodeIds = this.projectService.getFlattenedProjectAsNodeIds();
    this.nodes = Object.values(this.projectIdToOrder);
    this.nodes.sort(this.sortNodesByOrder);
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
  }

  private sortNodesByOrder(nodeA: any, nodeB: any): number {
    return nodeA.order - nodeB.order;
  }

  protected showDownloadingExportMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Downloading Export`
      },
      disableClose: false
    });
  }

  protected hideDownloadingExportMessage(): void {
    this.dialog.closeAll();
  }

  protected getSelectedNodesToExport(): any[] {
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
   * @param users An array of user objects. Each user object contains an id and name.
   * @returns {object} An object that contains key/value pairs. The key is userIdX
   * or studentNameX where X is an integer. The values are the corresponding actual
   * values of user id and student name.
   */
  extractUserIDsAndStudentNames(users: any[]): Record<string, number | string> {
    const userIDsAndStudentNames = {};
    for (let u = 0; u < users.length; u++) {
      let user = users[u];
      userIDsAndStudentNames['userId' + (u + 1)] = user.id;
      if (this.canViewStudentNames) {
        userIDsAndStudentNames['studentName' + (u + 1)] = user.name;
      }
    }
    return userIDsAndStudentNames;
  }

  protected goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
