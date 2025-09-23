import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { NodeService } from '../../services/nodeService';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
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
  styleUrl: 'step-tools.component.scss',
  templateUrl: 'step-tools.component.html'
})
export class StepToolsComponent {
  protected icons: any;
  protected nextId: any;
  protected nodeId: string;
  protected nodeIds: string[];
  protected prevId: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    protected dataService: TeacherDataService,
    protected dir: Directionality,
    protected nodeService: NodeService,
    protected projectService: TeacherProjectService
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
      this.dataService.currentNodeChanged$.subscribe(() => {
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

  protected calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected nodeChanged(): void {
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
  }

  protected updateModel(): void {
    this.nodeId = this.getNodeId();
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

  protected getNodeId(): string {
    return this.dataService.getCurrentNodeId();
  }

  protected getPrevNodeId(): string {
    return this.nodeService.getPrevNodeId(this.nodeId);
  }

  protected getNextNodeId(): Promise<any> {
    return this.nodeService.getNextNodeId(this.nodeId);
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected goToPrevNode(): void {
    this.nodeService.goToPrevNode();
    this.nodeId = this.dataService.getCurrentNodeId();
  }

  protected goToNextNode(): Promise<void> {
    return this.nodeService.goToNextNode().then((nodeId: string) => {
      this.nodeId = nodeId;
    });
  }
}
