import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { DataExportContext } from '../DataExportContext';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { MatchComponentDataExportStrategy } from '../strategies/MatchComponentDataExportStrategy';
import { DiscussionComponentDataExportStrategy } from '../strategies/DiscussionComponentDataExportStrategy';
import { DialogGuidanceComponentDataExportStrategy } from '../strategies/DialogGuidanceComponentDataExportStrategy';
import { OpenResponseComponentDataExportStrategy } from '../strategies/OpenResponseComponentExportStrategy';
import { LabelComponentDataExportStrategy } from '../strategies/LabelComponentDataExportStrategy';
import { PeerChatComponentDataExportStrategy } from '../strategies/PeerChatComponentDataExportStrategy';
import { DataExportStrategy } from '../strategies/DataExportStrategy';
import { DialogWithSpinnerComponent } from '../../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { AnnotationService } from '../../../services/annotationService';

@Component({
  selector: 'export-item',
  templateUrl: './export-item.component.html',
  styleUrls: ['./export-item.component.scss']
})
export class ExportItemComponent implements OnInit {
  allowedComponentTypesForAllRevisions = [
    'DialogGuidance',
    'Discussion',
    'Label',
    'Match',
    'OpenResponse',
    'PeerChat'
  ];
  allowedComponentTypesForLatestRevisions = ['DialogGuidance', 'Label', 'Match', 'OpenResponse'];
  canViewStudentNames: boolean = false;
  componentExportTooltips = {
    match: $localize`Correctness column key: 0 = Incorrect, 1 = Correct, 2 = Correct bucket but wrong position`
  };
  dataExportContext: DataExportContext;
  includeCorrectnessColumns: boolean = true;
  includeOnlySubmits: boolean = false;
  includeStudentNames: boolean;
  nodes: any[] = [];
  project: any;
  projectIdToOrder: any;
  workSelectionType: string;

  constructor(
    public annotationService: AnnotationService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    public dataService: TeacherDataService,
    private dialog: MatDialog,
    public projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataExportContext = new DataExportContext(this as any);
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.includeStudentNames = this.canViewStudentNames;
    this.project = this.projectService.project;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.nodes = Object.values(this.projectIdToOrder);
    this.nodes.sort(this.sortNodesByOrder);
  }

  private sortNodesByOrder(nodeA: any, nodeB: any): number {
    return nodeA.order - nodeB.order;
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected canExportAllRevisionsForComponent(component: any): boolean {
    return this.canExportForComponent(component, this.allowedComponentTypesForAllRevisions);
  }

  protected canExportLatestRevisionsForComponent(component: any): boolean {
    return this.canExportForComponent(component, this.allowedComponentTypesForLatestRevisions);
  }

  private canExportForComponent(component: any, allowedComponentTypes: string[]): boolean {
    for (const allowedComponentType of allowedComponentTypes) {
      if (component.type === allowedComponentType) {
        return true;
      }
    }
    return false;
  }

  protected exportComponentAllRevisions(nodeId: string, component: any): void {
    this.setAllWorkSelectionType();
    let strategy: DataExportStrategy;
    if (component.type === 'Match') {
      strategy = new MatchComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'all'
      );
    } else if (component.type === 'Discussion') {
      strategy = new DiscussionComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams()
      );
    } else if (component.type === 'DialogGuidance') {
      strategy = new DialogGuidanceComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'all'
      );
    } else if (component.type === 'OpenResponse') {
      strategy = new OpenResponseComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'all'
      );
    } else if (component.type === 'Label') {
      strategy = new LabelComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'all'
      );
    } else if (component.type === 'PeerChat') {
      strategy = new PeerChatComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams()
      );
    }
    this.export(strategy);
  }

  protected exportComponentLatestRevisions(nodeId: string, component: any): void {
    this.setLatestWorkSelectionType();
    let strategy: DataExportStrategy;
    if (component.type === 'Match') {
      strategy = new MatchComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'latest'
      );
    } else if (component.type === 'DialogGuidance') {
      strategy = new DialogGuidanceComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'latest'
      );
    } else if (component.type === 'OpenResponse') {
      strategy = new OpenResponseComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'latest'
      );
    } else if (component.type === 'Label') {
      strategy = new LabelComponentDataExportStrategy(
        nodeId,
        component,
        this.getComponentDataExportParams(),
        'latest'
      );
    }
    this.export(strategy);
  }

  private export(strategy: DataExportStrategy): void {
    this.showDownloadingExportMessage();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }

  private setAllWorkSelectionType(): void {
    this.setWorkSelectionType('exportAllWork');
  }

  private setLatestWorkSelectionType(): void {
    this.setWorkSelectionType('exportLatestWork');
  }

  private setWorkSelectionType(workSelectionType: string): void {
    this.workSelectionType = workSelectionType;
  }

  private getComponentDataExportParams(): ComponentDataExportParams {
    return {
      canViewStudentNames: this.canViewStudentNames,
      includeOnlySubmits: this.includeOnlySubmits,
      includeStudentNames: this.includeStudentNames,
      workSelectionType: this.workSelectionType
    };
  }

  protected goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  protected previewProject(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}`);
  }

  protected previewNode(node: any): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}/${node.id}`);
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
}
