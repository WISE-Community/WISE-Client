import { Component } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-guidance-show-work',
  templateUrl: './dialog-guidance-show-work.component.html',
  styleUrls: [
    '../dialog-guidance-student/dialog-guidance-student.component.scss',
    './dialog-guidance-show-work.component.scss'
  ]
})
export class DialogGuidanceShowWorkComponent extends ComponentShowWorkDirective {
  computerAvatar: ComputerAvatar;
  responses: DialogResponse[];

  constructor(
    private computerAvatarService: ComputerAvatarService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    this.responses = this.componentState.studentData.responses;
    this.computerAvatar = this.computerAvatarService.getAvatar(
      this.componentState.studentData.computerAvatarId
    );
  }
}
