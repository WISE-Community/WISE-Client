import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotifyAuthorService } from '../../services/notifyAuthorService';
import { ConcurrentAuthorsMessageComponent } from '../concurrent-authors-message/concurrent-authors-message.component';

@Component({
  imports: [ConcurrentAuthorsMessageComponent, RouterModule],
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
