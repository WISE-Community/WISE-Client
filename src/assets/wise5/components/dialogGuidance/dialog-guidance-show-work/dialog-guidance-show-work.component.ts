import { Component } from '@angular/core';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { MatCardModule } from '@angular/material/card';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';

@Component({
  imports: [DialogResponsesComponent, MatCardModule],
  selector: 'dialog-guidance-show-work',
  standalone: true,
  styleUrls: [
    '../dialog-guidance-student/dialog-guidance-student.component.scss',
    './dialog-guidance-show-work.component.scss'
  ],
  template: `
    <mat-card appearance="outlined" class="mat-elevation-z2">
      <dialog-responses
        [computerAvatar]="computerAvatar"
        [responses]="componentState.studentData.responses"
      />
    </mat-card>
  `
})
export class DialogGuidanceShowWorkComponent extends ComponentShowWorkDirective {
  protected computerAvatar: ComputerAvatar;

  constructor(
    private computerAvatarService: ComputerAvatarService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    this.computerAvatar = this.computerAvatarService.getAvatar(
      this.componentState.studentData.computerAvatarId
    );
  }
}
