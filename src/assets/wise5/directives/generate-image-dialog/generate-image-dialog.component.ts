import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConceptMapService } from '../../components/conceptMap/conceptMapService';
import { DrawService } from '../../components/draw/drawService';
import { EmbeddedService } from '../../components/embedded/embeddedService';
import { GraphService } from '../../components/graph/graphService';
import { LabelService } from '../../components/label/labelService';
import { TableService } from '../../components/table/tableService';
import { NodeService } from '../../services/nodeService';

@Component({
  selector: 'generate-image-dialog',
  templateUrl: './generate-image-dialog.component.html',
  styleUrls: ['./generate-image-dialog.component.scss']
})
export class GenerateImageDialogComponent implements OnInit {
  componentState: any;
  destroyDoneRenderingComponentListenerTimeout: any;
  doneRenderingComponentSubscription: Subscription;
  isFailedToImportWork: boolean = false;
  isImportingWork: boolean = true;

  constructor(
    private conceptMapService: ConceptMapService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GenerateImageDialogComponent>,
    private drawService: DrawService,
    private embeddedService: EmbeddedService,
    private graphService: GraphService,
    private labelService: LabelService,
    private nodeService: NodeService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.componentState = this.data;
    this.subscribeToDoneRenderingComponent();
    this.setDestroyTimeout();
  }

  subscribeToDoneRenderingComponent(): void {
    this.doneRenderingComponentSubscription = this.nodeService.doneRenderingComponent$.subscribe(
      ({ nodeId, componentId }) => {
        if (
          nodeId == this.componentState.nodeId &&
          componentId == this.componentState.componentId
        ) {
          setTimeout(() => {
            this.generateImage();
          }, 2000);
        }
      }
    );
  }

  generateImage(): void {
    this.getComponentService(this.componentState.componentType)
      .generateImageFromRenderedComponentState(this.componentState)
      .then((image: any) => {
        clearTimeout(this.destroyDoneRenderingComponentListenerTimeout);
        this.doneRenderingComponentSubscription.unsubscribe();
        this.dialogRef.close(image);
      });
  }

  /*
   * Set a timeout to destroy the listener in case there is an error creating the image and
   * we don't get to destroying it after we generate the image.
   */
  setDestroyTimeout(): void {
    this.destroyDoneRenderingComponentListenerTimeout = setTimeout(() => {
      this.doneRenderingComponentSubscription.unsubscribe();
      this.setFailedToImportWork();
    }, 10000);
  }

  setFailedToImportWork(): void {
    this.isImportingWork = false;
    this.isFailedToImportWork = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getComponentService(componentType: string): any {
    switch (componentType) {
      case 'ConceptMap':
        return this.conceptMapService;
      case 'Draw':
        return this.drawService;
      case 'Embedded':
        return this.embeddedService;
      case 'Graph':
        return this.graphService;
      case 'Label':
        return this.labelService;
      case 'Table':
        return this.tableService;
    }
  }
}
