import { fabric } from 'fabric';
import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { LabelService } from '../labelService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'label-show-work',
  standalone: true,
  styleUrl: 'label-show-work.component.scss',
  templateUrl: 'label-show-work.component.html'
})
export class LabelShowWorkComponent extends ComponentShowWorkDirective {
  protected canvasId: string;
  private canvas: any;

  constructor(
    private labelService: LabelService,
    protected nodeService: NodeService,
    protected projectService: ProjectService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.canvasId = this.getCanvasIdPrefix() + this.componentState.id;
    this.enableFabricTextPadding();
    // wait for angular to completely render the html before we initialize the canvas
    setTimeout(() => {
      this.setupCanvas();
    });
  }

  private getCanvasIdPrefix(): string {
    return this.isRevision ? 'label-canvas-revision-' : 'label-canvas-';
  }

  private enableFabricTextPadding(): void {
    fabric.Text.prototype.set({
      _getNonTransformedDimensions() {
        return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
      },
      _calculateCurrentDimensions() {
        return fabric.util.transformPoint(
          this._getTransformedDimensions(),
          this.getViewportTransform(),
          true
        );
      }
    });
  }

  private setupCanvas(): void {
    const isDisabled: boolean = true;
    this.canvas = this.labelService.initializeCanvas(
      this.canvasId,
      this.componentContent.width,
      this.componentContent.height,
      isDisabled
    );
    this.setStudentWork(this.canvas, this.componentContent, this.componentState);
  }

  private setStudentWork(canvas: any, componentContent: any, componentState: any): void {
    this.labelService.addLabelsToCanvas(
      canvas,
      componentState.studentData.labels,
      componentContent.width,
      componentContent.height,
      componentContent.pointSize,
      componentContent.fontSize,
      componentContent.labelWidth,
      componentContent.enableCircles,
      componentState.studentData.version
    );
    this.labelService.setBackgroundImage(canvas, componentState.studentData.backgroundImage);
  }
}
