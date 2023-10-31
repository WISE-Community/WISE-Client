import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithOpenInNewWindowComponent } from '../../../../directives/dialog-with-open-in-new-window/dialog-with-open-in-new-window.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'node-progress-view',
  templateUrl: './node-progress-view.component.html',
  styleUrls: ['./node-progress-view.component.scss']
})
export class NodeProgressViewComponent implements OnInit {
  protected nodeId: string;
  nodeIdToExpanded: any = {};
  protected rootNode: any;
  protected showRubricButton: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.nodeId = this.route.snapshot.paramMap.get('nodeId') || this.projectService.rootNode.id;
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
    const startNodeId = this.projectService.getStartNodeId();
    this.rootNode = this.projectService.getRootNode(startNodeId);
    this.showRubricButton = this.projectHasRubric();
    this.subscribeToCurrentNodeChanged();
    if (!this.isShowingNodeGradingView()) {
      this.saveNodeProgressViewDisplayedEvent();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  private subscribeToCurrentNodeChanged(): void {
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        this.nodeId = currentNode.id;
        this.dataService.setCurrentNode(currentNode);
        if (this.nodeId === 'group0') {
          this.collapseAll();
        } else {
          this.nodeIdToExpanded[this.nodeId] = true;
        }
        this.router.navigate([
          '/teacher/manage/unit',
          this.configService.getRunId(),
          'node',
          this.nodeId
        ]);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private isShowingNodeGradingView(): boolean {
    return this.isApplicationNode(this.nodeId);
  }

  private saveNodeProgressViewDisplayedEvent(): void {
    const context = 'ClassroomMonitor',
      nodeId = this.nodeId,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'nodeProgressViewDisplayed',
      data = { nodeId: this.nodeId };
    this.dataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected isApplicationNode(nodeId: string): boolean {
    return this.projectService.isApplicationNode(nodeId);
  }

  private projectHasRubric(): boolean {
    const projectRubric = this.projectService.getProjectRubric();
    return projectRubric != null && projectRubric != '';
  }

  showRubric(): void {
    this.dialog.open(DialogWithOpenInNewWindowComponent, {
      data: {
        content: this.projectService.replaceAssetPaths(this.projectService.getProjectRubric()),
        scroll: true,
        title: this.projectService.getProjectTitle()
      },
      panelClass: 'dialog-lg'
    });
  }

  childExpandedEvent({ nodeId, expanded }): void {
    this.collapseAll();
    this.nodeIdToExpanded[nodeId] = expanded;
  }

  protected collapseAll(): void {
    for (const key of Object.keys(this.nodeIdToExpanded)) {
      this.nodeIdToExpanded[key] = false;
    }
  }
}
