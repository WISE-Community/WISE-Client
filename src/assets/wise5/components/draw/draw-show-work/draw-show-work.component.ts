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

  getDrawingToolId(): string {
    return this.getDrawingToolIdPrefix() + this.componentState.id;
  }

  getDrawingToolIdPrefix(): string {
    if (this.isRevision) {
      return 'drawing-tool-revision-';
    } else {
      return 'drawing-tool-';
    }
  }

  initializeDrawingTool(): void {
    this.drawingTool = this.DrawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.componentContent.width,
      this.componentContent.height
    );
    this.DrawService.setUpTools(this.drawingToolId, this.componentContent.tools, false);
    this.drawingTool.canvas.removeListeners();
  }

  setStudentWork(): void {
    this.drawingTool.load(this.componentState.studentData.drawData);
  }
}
