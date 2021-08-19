import { Component, ViewEncapsulation } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { ProjectService } from '../../../services/projectService';
import { DrawService } from '../drawService';

@Component({
  selector: 'draw-grading',
  templateUrl: 'draw-grading.component.html',
  styleUrls: ['draw-grading.component.scss', '../drawing-tool.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawGrading extends ComponentGrading {
  drawingToolId: string;
  drawingTool: any;

  constructor(private DrawService: DrawService, protected ProjectService: ProjectService) {
    super(ProjectService);
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
