import { Component, Input } from '@angular/core';
import { NotifyAuthorService } from '../../services/notifyAuthorService';
import { RouterModule } from '@angular/router';
import { ConcurrentAuthorsMessageComponent } from '../concurrent-authors-message/concurrent-authors-message.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [ConcurrentAuthorsMessageComponent, FlexLayoutModule, RouterModule],
  styleUrl: './project-authoring-parent.component.scss',
  templateUrl: './project-authoring-parent.component.html'
})
export class ProjectAuthoringParentComponent {
  @Input('unitId') protected projectId?: number;

  constructor(private notifyAuthorService: NotifyAuthorService) {}

  ngOnInit(): void {
    this.projectId = Number(this.projectId);
    this.notifyAuthorService.editBegin(this.projectId);
    window.onbeforeunload = (event) => {
      this.notifyAuthorService.editEnd(this.projectId);
    };
  }

  ngOnDestroy(): void {
    this.notifyAuthorService.editEnd(this.projectId);
  }
}
