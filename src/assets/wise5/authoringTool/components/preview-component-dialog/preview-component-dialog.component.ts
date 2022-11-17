import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  templateUrl: 'preview-component-dialog.component.html',
  styleUrls: ['preview-component-dialog.component.scss']
})
export class PreviewComponentDialogComponent implements OnInit {
  canSaveStarterState: boolean;
  component: WISEComponent;
  @Input() componentId: string;
  componentTypesWithStarterStates = ['ConceptMap', 'Draw', 'Label'];
  @Input() nodeId: string;
  starterState: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    const content = this.projectService.injectAssetPaths(
      this.projectService.getComponent(this.nodeId, this.componentId)
    );
    this.canSaveStarterState = this.componentTypesWithStarterStates.includes(content.type);
    this.component = new WISEComponent(content, this.nodeId);
  }

  updateStarterState(starterState: any): void {
    this.starterState = starterState;
  }
}
