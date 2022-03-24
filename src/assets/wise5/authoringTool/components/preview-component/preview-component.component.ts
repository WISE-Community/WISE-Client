import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from '../../../services/projectService';

@Component({
  selector: 'preview-component',
  templateUrl: 'preview-component.component.html'
})
export class PreviewComponentComponent implements OnInit {
  componentContent: any;

  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  @Output()
  starterStateChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.componentContent = this.projectService.injectAssetPaths(
      this.projectService.getComponentByNodeIdAndComponentId(this.nodeId, this.componentId)
    );
  }

  updateStarterState(starterState: any) {
    this.starterStateChangedEvent.emit(starterState);
  }
}
