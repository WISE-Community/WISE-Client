import { Directive, Input } from '@angular/core';
import { ProjectService } from '../services/projectService';

@Directive()
export abstract class ComponentShowWorkDirective {
  @Input()
  nodeId: string;

  @Input()
  componentId: string;

  @Input()
  componentState: any;

  @Input()
  isRevision: boolean = false;

  componentContent: any;

  constructor(protected projectService: ProjectService) {}

  ngOnInit() {
    this.componentContent = this.projectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
  }

  ngOnDestroy(): void {}

  isForThisComponent(object: any): boolean {
    return object.nodeId === this.nodeId && object.componentId === this.componentId;
  }
}
