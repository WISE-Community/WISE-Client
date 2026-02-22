import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeStatusService } from '../../services/nodeStatusService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';
import { NodeService } from '../../services/nodeService';
import { MatTabsModule } from '@angular/material/tabs';
import { NotebookLauncherComponent } from '../../../../app/notebook/notebook-launcher/notebook-launcher.component';
import { ChatbotLauncherComponent } from '../../../../app/chatbot/chatbot-launcher/chatbot-launcher.component';

class GroupNode {
  id: string;
  disabled: boolean;
  startId: string;
  title: string;
}

@Component({
  imports: [ChatbotLauncherComponent, MatTabsModule, NotebookLauncherComponent],
  selector: 'group-tabs',
  templateUrl: './group-tabs.component.html'
})
export class GroupTabsComponent implements OnInit {
  @Input() chatbotEnabled: boolean;
  @Output() toggleChatbot = new EventEmitter<void>();
  protected groupNodes: GroupNode[] = [];
  @Input() notebookConfig: any;
  protected selectedTabIndex: number;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: VLEProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.setGroupNodes();
    this.selectCurrentGroupTab();
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.setGroupNodes();
      })
    );
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.selectCurrentGroupTab();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setGroupNodes(): void {
    this.groupNodes = this.projectService.rootNode.ids.map((id: string) => {
      const node: GroupNode = this.projectService.getNodeById(id);
      node.disabled = !this.nodeStatusService.canVisitNode(node.id);
      return node;
    });
  }

  private selectCurrentGroupTab(): void {
    const currentNode = this.studentDataService.getCurrentNode();
    this.selectedTabIndex = this.groupNodes.indexOf(
      this.projectService.getParentGroup(currentNode.id)
    );
  }

  protected goToGroupTab(groupTabIndex: number): void {
    const groupStartNodeId = this.groupNodes[groupTabIndex].startId;
    this.nodeService.setCurrentNode(groupStartNodeId);
  }

  protected emitToggleChatbot(): void {
    this.toggleChatbot.emit();
  }
}
