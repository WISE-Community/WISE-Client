import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NodeIconComponent } from '../../../../vle/node-icon/node-icon.component';
import { NodeService } from '../../../../services/nodeService';
import { NodeStatusIconComponent } from '../nodeStatusIcon/node-status-icon.component';
import { NodeStatusService } from '../../../../services/nodeStatusService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { Subscription } from 'rxjs';
import { NotebookLauncherComponent } from '../../../../../../app/notebook/notebook-launcher/notebook-launcher.component';
import { ChatbotLauncherComponent } from '../../../../../../app/chatbot/chatbot-launcher/chatbot-launcher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    ChatbotLauncherComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NodeIconComponent,
    NodeStatusIconComponent,
    NotebookLauncherComponent
  ],
  selector: 'step-tools',
  styleUrl: './step-tools.component.scss',
  templateUrl: './step-tools.component.html'
})
export class StepToolsComponent implements OnInit {
  private dataService = inject(StudentDataService);
  private nodeService = inject(NodeService);
  private nodeStatusService = inject(NodeStatusService);
  private projectService = inject(ProjectService);

  @Input() chatbotEnabled: boolean;
  @Output() toggleChatbot = new EventEmitter<void>();
  protected icons: any;
  protected isSurvey: boolean;
  protected is_rtl: boolean;
  protected nextId: string;
  protected nodeId: string;
  protected nodeIds: string[];
  protected nodeStatus: any;
  protected nodeStatuses: any;
  @Input() notebookConfig: any;
  protected prevId: string;
  @Input() stepView: boolean;
  private subscriptions: Subscription = new Subscription();
  protected toNodeId: string;

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.calculateNodeIds();
    this.nodeStatuses = this.nodeStatusService.getNodeStatuses();
    this.updateModel();
    this.subscribeToChanges();
  }

  private subscribeToChanges(): void {
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(() => this.updateModel())
    );
    this.subscriptions.add(
      this.dataService.nodeStatusesChanged$.subscribe(() => this.updateModel())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateNodeIds(): void {
    this.nodeIds = Object.keys(this.projectService.idToOrder);
    this.nodeIds.shift(); // remove the 'group0' master root node from consideration
  }

  protected toNodeIdChanged(): void {
    this.nodeService.setCurrentNode(this.toNodeId);
  }

  private updateModel(): void {
    const nodeId = this.dataService.getCurrentNodeId();
    if (!this.projectService.isGroupNode(nodeId)) {
      this.nodeId = nodeId;
      this.nodeStatus = this.nodeStatuses[this.nodeId];
      this.prevId = this.nodeService.getPrevNodeId();
      this.nextId = null;
      this.nodeService.getNextNodeId().then((nodeId: string) => {
        this.nextId = nodeId;
      });
      this.toNodeId = this.nodeId;
    }
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected goToPrevNode(): void {
    this.nodeService.goToPrevNode();
  }

  protected goToNextNode(): void {
    this.nodeService.goToNextNode();
  }

  protected closeNode(): void {
    this.nodeService.closeNode();
  }

  protected emitToggleChatbot(): void {
    this.toggleChatbot.emit();
  }
}
