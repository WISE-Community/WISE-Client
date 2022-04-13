import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-connected-component-node-select',
  templateUrl: './edit-connected-component-node-select.component.html',
  styleUrls: ['./edit-connected-component-node-select.component.scss']
})
export class EditConnectedComponentNodeSelectComponent implements OnInit {
  @Input()
  connectedComponent: any;

  @Output()
  connectedComponentChange: EventEmitter<any> = new EventEmitter();

  nodeIds: string[] = [];

  constructor(private ProjectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();
  }

  isApplicationNode(nodeId: string): boolean {
    return this.ProjectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitleByNodeId(nodeId: string): string {
    return this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
  }

  connectedComponentNodeIdChanged() {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
