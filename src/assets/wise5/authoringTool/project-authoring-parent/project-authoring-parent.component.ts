import { Component, Input } from '@angular/core';
import { NotifyAuthorService } from '../../services/notifyAuthorService';

@Component({
  templateUrl: './project-authoring-parent.component.html',
  styleUrls: ['./project-authoring-parent.component.scss']
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
