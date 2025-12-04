import { Component } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MatCardModule } from '@angular/material/card';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import { UserService } from '../../../../../app/services/user.service';

@Component({
  imports: [DialogResponsesComponent, MatCardModule],
  selector: 'dialog-guidance-show-work',
  styleUrls: [
    '../dialog-guidance-student/dialog-guidance-student.component.scss',
    './dialog-guidance-show-work.component.scss'
  ],
  template: `
    <mat-card appearance="outlined" class="mat-elevation-z2">
      <dialog-responses
        [computerAvatar]="computerAvatar"
        [cRaterRubric]="cRaterRubric"
        [responses]="componentState.studentData.responses"
        [showDetectedIdeas]="isTeacher"
      />
    </mat-card>
  `
})
export class DialogGuidanceShowWorkComponent extends ComponentShowWorkDirective {
  protected computerAvatar: ComputerAvatar;
  protected cRaterRubric: CRaterRubric;
  protected isTeacher: boolean = false;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    private cRaterService: CRaterService,
    protected nodeService: NodeService,
    protected projectService: ProjectService,
    protected userService: UserService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    this.isTeacher = this.userService.isTeacher();
    this.computerAvatar = this.computerAvatarService.getAvatar(
      this.componentState.studentData.computerAvatarId
    );
    this.cRaterRubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
  }
}
