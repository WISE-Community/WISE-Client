import { Directive, Input, inject } from '@angular/core';
import { ProjectService } from '../services/projectService';
import { NodeService } from '../services/nodeService';

@Directive()
export abstract class ComponentShowWorkDirective {
  componentContent: any;
  @Input() componentId: string;
  @Input() componentState: any;
  @Input() isRevision: boolean = false;
  @Input() nodeId: string;
  protected nodeService = inject(NodeService);
  protected projectService = inject(ProjectService);

  ngOnInit(): void {
    this.componentContent = this.projectService.injectAssetPaths(
      this.projectService.getComponent(this.nodeId, this.componentId)
    );
    this.componentState = this.projectService.injectAssetPaths(this.componentState);
  }

  ngAfterViewInit(): void {
    this.nodeService.broadcastDoneRenderingComponent({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  ngOnDestroy(): void {}
}
