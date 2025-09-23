import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { ComponentDataExportParams } from '../ComponentDataExportParams';
import { MatchComponentDataExportStrategy } from '../strategies/MatchComponentDataExportStrategy';
import { DiscussionComponentDataExportStrategy } from '../strategies/DiscussionComponentDataExportStrategy';
import { DialogGuidanceComponentDataExportStrategy } from '../strategies/DialogGuidanceComponentDataExportStrategy';
import { OpenResponseComponentDataExportStrategy } from '../strategies/OpenResponseComponentExportStrategy';
import { LabelComponentDataExportStrategy } from '../strategies/LabelComponentDataExportStrategy';
import { PeerChatComponentDataExportStrategy } from '../strategies/PeerChatComponentDataExportStrategy';
import { DialogWithSpinnerComponent } from '../../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AbstractComponentDataExportStrategy } from '../strategies/AbstractComponentDataExportStrategy';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'export-item',
  styleUrl: './export-item.component.scss',
  templateUrl: './export-item.component.html'
})
export class ExportItemComponent implements OnInit {
  private allowedComponentTypesAllRevisions = [
    'DialogGuidance',
    'Discussion',
    'Label',
    'Match',
    'OpenResponse',
    'PeerChat'
  ];
  private allowedComponentTypesLatestRevisions = [
    'DialogGuidance',
    'Label',
    'Match',
    'OpenResponse'
  ];
  protected canViewStudentNames: boolean = false;
  protected componentExportTooltips = {
    Match: $localize`Correctness column key: 0 = Incorrect, 1 = Correct, 2 = Correct bucket but wrong position`
  };
  protected includeCorrectnessColumns: boolean = true;
  protected includeOnlySubmits: boolean = false;
  protected includeStudentNames: boolean;
  protected nodes: any[] = [];
  protected project: any;
  private projectIdToOrder: any;
  private workSelectionType: 'exportAllWork' | 'exportLatestWork';

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
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.includeStudentNames = this.canViewStudentNames;
    this.project = this.projectService.project;
    const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
    this.projectIdToOrder = nodeOrderOfProject.idToOrder;
    this.nodes = Object.values(this.projectIdToOrder);
    this.nodes.sort((nodeA, nodeB) => nodeA.order - nodeB.order);
  }

  protected getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected canExport(component: any, exportType: 'all' | 'latest'): boolean {
    return exportType === 'all'
      ? this.allowedComponentTypesAllRevisions.includes(component.type)
      : this.allowedComponentTypesLatestRevisions.includes(component.type);
  }

  protected export(
    nodeId: string,
    component: any,
    workSelectionType: 'exportAllWork' | 'exportLatestWork'
  ): void {
    this.workSelectionType = workSelectionType;
    const strategy = this.getExportStrategy(nodeId, component);
    this.showDownloadingExportMessage();
    strategy.setDataExportContext({ controller: this } as any);
    strategy.export();
    this.hideDownloadingExportMessage();
  }

  private getExportStrategy(nodeId: string, component: any): AbstractComponentDataExportStrategy {
    const strategies = {
      Match: MatchComponentDataExportStrategy,
      Discussion: DiscussionComponentDataExportStrategy,
      DialogGuidance: DialogGuidanceComponentDataExportStrategy,
      OpenResponse: OpenResponseComponentDataExportStrategy,
      Label: LabelComponentDataExportStrategy,
      PeerChat: PeerChatComponentDataExportStrategy
    };
    const strategy = new strategies[component.type](
      nodeId,
      component,
      this.getComponentDataExportParams()
    );
    strategy.setAllOrLatest(this.workSelectionType == 'exportAllWork' ? 'all' : 'latest');
    return strategy;
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

  private showDownloadingExportMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Downloading export`
      },
      disableClose: false
    });
  }

  private hideDownloadingExportMessage(): void {
    this.dialog.closeAll();
  }
}
