import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-connected-component-node-select',
  templateUrl: './edit-connected-component-node-select.component.html',
  styleUrls: ['./edit-connected-component-node-select.component.scss']
})
export class EditConnectedComponentNodeSelectComponent implements OnInit {
  @Input() connectedComponent: any;
  @Output() connectedComponentChange: EventEmitter<any> = new EventEmitter();
  nodeIds: string[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.nodeIds = this.projectService.getFlattenedProjectAsNodeIds();
  }

  isApplicationNode(nodeId: string): boolean {
    return this.projectService.isApplicationNode(nodeId);
  }

  getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  connectedComponentNodeIdChanged(): void {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
