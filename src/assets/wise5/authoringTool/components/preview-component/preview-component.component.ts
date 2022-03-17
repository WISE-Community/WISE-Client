import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/projectService';

@Component({
  templateUrl: 'preview-component.component.html'
})
export class PreviewComponentComponent implements OnInit {
  componentContent: any;

  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.componentContent = this.projectService.injectAssetPaths(
      this.projectService.getComponentByNodeIdAndComponentId(this.nodeId, this.componentId)
    );
  }
}
