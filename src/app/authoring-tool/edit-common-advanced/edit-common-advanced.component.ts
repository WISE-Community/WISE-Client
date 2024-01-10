import { Component, Input, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-common-advanced',
  templateUrl: './edit-common-advanced.component.html',
  styleUrls: ['./edit-common-advanced.component.scss']
})
export class EditCommonAdvancedComponent implements OnInit {
  @Input()
  allowedConnectedComponentTypes: string[] = [];

  @Input()
  componentContent: any;

  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  constructor(protected ProjectService: TeacherProjectService) {}

  ngOnInit(): void {}

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.componentContent.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  maxSubmitCountChanged(maxSubmitCount: number): void {
    this.componentChanged();
  }

  componentChanged(): void {
    this.ProjectService.nodeChanged();
  }
}
