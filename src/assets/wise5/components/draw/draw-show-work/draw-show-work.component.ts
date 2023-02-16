import { Component, ViewEncapsulation } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DrawService } from '../drawService';

@Component({
  selector: 'draw-show-work',
  templateUrl: 'draw-show-work.component.html',
  styleUrls: ['draw-show-work.component.scss', '../drawing-tool.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawShowWorkComponent extends ComponentShowWorkDirective {
  drawingToolId: string;
  drawingTool: any;

  constructor(
    private DrawService: DrawService,
    protected nodeService: NodeService,
    protected ProjectService: ProjectService
  ) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.drawingToolId = this.getDrawingToolId();
  }

  ngAfterViewInit(): void {
    this.initializeDrawingTool();
    this.setStudentWork();
  }

  ngOnDestroy(): void {
    $(`#${this.drawingToolId}`).remove();
  }

  private getDrawingToolId(): string {
    const componentStateId = this.componentState.id;
    return this.isRevision
      ? `drawing-tool-revision-${componentStateId}`
      : `drawing-tool-${componentStateId}`;
  }

  private initializeDrawingTool(): void {
    this.drawingTool = this.DrawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.componentContent.width,
      this.componentContent.height
    );
    this.DrawService.setUpTools(this.drawingToolId, this.componentContent.tools, false);
    this.drawingTool.canvas.removeListeners();
  }

  private setStudentWork(): void {
    this.drawingTool.load(this.componentState.studentData.drawData);
  }
}
