import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DrawService } from '../drawService';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'draw-show-work',
  styleUrls: ['draw-show-work.component.scss', '../drawing-tool.scss'],
  template: `<div class="component--grading__response__content">
    <div id="{{ drawingToolId }}" class="drawing-tool"></div>
  </div> `
})
export class DrawShowWorkComponent extends ComponentShowWorkDirective {
  private drawService = inject(DrawService);
  private drawingTool: any;
  protected drawingToolId: string;

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
    this.drawingTool = this.drawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.componentContent.width,
      this.componentContent.height
    );
    this.drawService.setUpTools(this.drawingToolId, this.componentContent.tools, false);
    this.drawingTool.canvasOnly();
    this.drawingTool.canvas.removeListeners();
  }

  private setStudentWork(): void {
    this.drawingTool.load(this.componentState.studentData.drawData);
  }
}
