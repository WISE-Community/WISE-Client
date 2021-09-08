import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-connected-component-component-select',
  templateUrl: './edit-connected-component-component-select.component.html',
  styleUrls: ['./edit-connected-component-component-select.component.scss']
})
export class EditConnectedComponentComponentSelectComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  connectedComponent: any;

  @Input()
  allowedConnectedComponentTypes: string[];

  @Output()
  connectedComponentChange: EventEmitter<any> = new EventEmitter();

  constructor(private ProjectService: ProjectService) {}

  ngOnInit(): void {}

  getComponentsByNodeId(nodeId: string): any[] {
    return this.ProjectService.getComponentsByNodeId(nodeId);
  }

  isConnectedComponentTypeAllowed(componentType: string): boolean {
    return this.allowedConnectedComponentTypes.includes(componentType);
  }

  connectedComponentComponentIdChanged() {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
