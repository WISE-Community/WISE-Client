import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'edit-connected-component-component-select',
  templateUrl: './edit-connected-component-component-select.component.html',
  styleUrls: ['./edit-connected-component-component-select.component.scss']
})
export class EditConnectedComponentComponentSelectComponent implements OnInit {
  @Input() allowedConnectedComponentTypes: string[];
  @Input() componentId: string;
  @Input() connectedComponent: any;
  @Output() connectedComponentChange: EventEmitter<any> = new EventEmitter();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {}

  getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  isConnectedComponentTypeAllowed(componentType: string): boolean {
    return this.allowedConnectedComponentTypes.includes(componentType);
  }

  connectedComponentComponentIdChanged(): void {
    this.connectedComponentChange.emit(this.connectedComponent);
  }
}
