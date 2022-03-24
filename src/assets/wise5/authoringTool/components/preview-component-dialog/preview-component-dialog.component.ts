import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projectService';

@Component({
  templateUrl: 'preview-component-dialog.component.html',
  styleUrls: ['preview-component-dialog.component.scss']
})
export class PreviewComponentDialogComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  canSaveStarterState: boolean = false;

  componentTypesWithStarterStates = ['ConceptMap', 'Draw', 'Label'];

  starterState: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    const component = this.projectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.canSaveStarterState = this.componentTypesWithStarterStates.includes(component.type);
  }

  updateStarterState(starterState: any): void {
    this.starterState = starterState;
  }
}
