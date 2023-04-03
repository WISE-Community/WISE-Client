import { Directive, Input } from '@angular/core';
import { ProjectService } from '../services/projectService';
import { NodeService } from '../services/nodeService';

@Directive()
export abstract class ComponentShowWorkDirective {
  @Input() nodeId: string;
  @Input() componentId: string;
  @Input() componentState: any;
  @Input() isRevision: boolean = false;

  componentContent: any;

  constructor(protected nodeService: NodeService, protected projectService: ProjectService) {}

  ngOnInit() {
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
