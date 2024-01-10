import { fabric } from 'fabric';
import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { LabelService } from '../labelService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'label-show-work',
  templateUrl: 'label-show-work.component.html',
  styleUrls: ['label-show-work.component.scss']
})
export class LabelShowWorkComponent extends ComponentShowWorkDirective {
  canvasId: string;
  canvas: any;

  constructor(
    private LabelService: LabelService,
    protected nodeService: NodeService,
    protected ProjectService: ProjectService
  ) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.canvasId = this.getCanvasId();
    this.enableFabricTextPadding();
    // wait for angular to completely render the html before we initialize the canvas
    setTimeout(() => {
      this.setupCanvas();
    });
  }

  getCanvasId(): string {
    return this.getCanvasIdPrefix() + this.componentState.id;
  }

  getCanvasIdPrefix(): string {
    if (this.isRevision) {
      return 'label-canvas-revision-';
    } else {
      return 'label-canvas-';
    }
  }

  enableFabricTextPadding(): void {
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

  setupCanvas(): void {
    const isDisabled: boolean = true;
    this.canvas = this.LabelService.initializeCanvas(
      this.canvasId,
      this.componentContent.width,
      this.componentContent.height,
      isDisabled
    );
    this.setStudentWork(this.canvas, this.componentContent, this.componentState);
  }

  setStudentWork(canvas: any, componentContent: any, componentState: any): void {
    this.LabelService.addLabelsToCanvas(
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
    this.LabelService.setBackgroundImage(canvas, componentState.studentData.backgroundImage);
  }
}
