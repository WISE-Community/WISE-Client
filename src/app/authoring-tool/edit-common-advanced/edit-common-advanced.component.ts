import { Component, Input, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-common-advanced',
  templateUrl: './edit-common-advanced.component.html',
  styleUrls: ['./edit-common-advanced.component.scss']
})
export class EditCommonAdvancedComponent implements OnInit {
  @Input() allowedConnectedComponentTypes: string[] = [];
  @Input() component: WISEComponent;

  constructor(protected projectService: TeacherProjectService) {}

  ngOnInit(): void {}

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.component.content.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  componentChanged(): void {
    this.projectService.nodeChanged();
  }
}
