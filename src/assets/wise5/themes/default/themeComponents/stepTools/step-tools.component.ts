import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { ChatbotLauncherComponent } from '../../../../../../app/chatbot/chatbot-launcher/chatbot-launcher.component';
import { NotebookLauncherComponent } from '../../../../../../app/notebook/notebook-launcher/notebook-launcher.component';
import { NodeService } from '../../../../services/nodeService';
import { ProjectService } from '../../../../services/projectService';
import { StudentDataService } from '../../../../services/studentDataService';
import { StepSelectComponent } from '../stepSelect/step-select.component';

@Component({
  imports: [
    ChatbotLauncherComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NotebookLauncherComponent,
    StepSelectComponent
  ],
  selector: 'step-tools',
  templateUrl: './step-tools.component.html'
})
export class StepToolsComponent implements OnInit, OnDestroy {
  @Input() chatbotEnabled: boolean;
  protected icons: any;
  protected is_rtl: boolean;
  protected nextId: string;
  @Input() notebookConfig: any;
  protected prevId: string;
  @Input() stepView: boolean;
  private subscriptions: Subscription = new Subscription();
  @Output() toggleChatbot = new EventEmitter<void>();

  constructor(
    private nodeService: NodeService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.is_rtl = $('html').attr('dir') == 'rtl';
    this.icons = { prev: 'chevron_left', next: 'chevron_right' };
    if (this.is_rtl) {
      this.icons = { prev: 'chevron_right', next: 'chevron_left' };
    }
    this.updateModel();
    this.subscribeToChanges();
  }

  private subscribeToChanges(): void {
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.updateModel();
      })
    );
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.updateModel();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateModel(): void {
    const nodeId = this.studentDataService.getCurrentNodeId();
    if (!this.projectService.isGroupNode(nodeId)) {
      this.prevId = this.nodeService.getPrevNodeId();
      this.nextId = null;
      this.nodeService.getNextNodeId().then((nodeId: string) => {
        this.nextId = nodeId;
      });
    }
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
