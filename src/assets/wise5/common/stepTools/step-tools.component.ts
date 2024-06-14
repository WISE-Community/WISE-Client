import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ConfigService } from '../../services/configService';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NodeIconComponent
  ],
  selector: 'step-tools',
  standalone: true,
  styleUrl: 'step-tools.component.scss',
  templateUrl: 'step-tools.component.html'
})
export class StepToolsComponent {
  protected icons: any;
  protected nextId: any;
  protected nodeId: string;
  protected nodeIds: string[];
  protected prevId: any;
  @Input() showOnlyStepsWithWork: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private dir: Directionality,
    private nodeService: NodeService,
    private projectService: TeacherProjectService,
    private teacherDataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.calculateNodeIds();
    this.updateModel();
    if (this.dir.value === 'rtl') {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    } else {
      this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    }
    this.subscriptions.add(
      this.teacherDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.projectService.projectParsed$.subscribe(() => {
        this.calculateNodeIds();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    if (this.showOnlyStepsWithWork) {
      this.nodeIds = this.nodeIds.filter((nodeId) => {
        return this.isGroupNode(nodeId) || this.projectService.nodeHasWork(nodeId);
      });
    }
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected nodeChanged(): void {
    this.teacherDataService.setCurrentNodeByNodeId(this.nodeId);
  }

  private updateModel(): void {
    this.nodeId = this.teacherDataService.getCurrentNodeId();
    if (this.nodeId == null) {
      this.prevId = null;
      this.nextId = null;
    } else {
      if (!this.projectService.isGroupNode(this.nodeId)) {
        this.prevId = this.getPrevNodeId();
        this.getNextNodeId().then((nextId) => {
          this.nextId = nextId;
        });
      }
    }
  }

  private getPrevNodeId(): string {
    if (this.isClassroomMonitorMode()) {
      return this.nodeService.getPrevNodeIdWithWork(this.nodeId);
    } else {
      return this.nodeService.getPrevNodeId(this.nodeId);
    }
  }

  private getNextNodeId(): Promise<any> {
    if (this.isClassroomMonitorMode()) {
      return Promise.resolve(this.nodeService.getNextNodeIdWithWork(this.nodeId));
    } else {
      return this.nodeService.getNextNodeId(this.nodeId);
    }
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected goToPrevNode(): void {
    if (this.isClassroomMonitorMode()) {
      this.nodeService.goToPrevNodeWithWork();
    } else {
      this.nodeService.goToPrevNode();
    }
    this.nodeId = this.teacherDataService.getCurrentNodeId();
  }

  protected goToNextNode(): void {
    if (this.isClassroomMonitorMode()) {
      this.nodeService.goToNextNodeWithWork().then((nodeId: string) => {
        this.nodeId = nodeId;
      });
    } else {
      this.nodeService.goToNextNode().then((nodeId: string) => {
        this.nodeId = nodeId;
      });
    }
  }

  private isClassroomMonitorMode(): boolean {
    return this.configService.getMode() === 'classroomMonitor';
  }
}
