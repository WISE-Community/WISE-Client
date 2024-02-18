import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';

@Component({
  selector: 'ai-chat-show-work',
  templateUrl: './ai-chat-show-work.component.html',
  styleUrls: ['./ai-chat-show-work.component.scss']
})
export class AiChatShowWorkComponent extends ComponentShowWorkDirective {
  protected computerAvatar: ComputerAvatar;
  protected messages: any[] = [];
  protected workgroupId: number;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.computerAvatar = this.computerAvatarService.getAvatar(
      this.componentState.studentData.computerAvatarId
    );
    this.messages = this.componentState.studentData.messages;
    this.workgroupId = this.componentState.workgroupId;
  }
}
