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
import { CommonModule } from '@angular/common';
import { ComponentComponent } from '../../components/component/component.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [
    CommonModule,
    ComponentComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  standalone: true,
  styleUrl: './generate-image-dialog.component.scss',
  templateUrl: './generate-image-dialog.component.html'
})
export class GenerateImageDialogComponent implements OnInit {
  private destroyDoneRenderingComponentListenerTimeout: any;
  private doneRenderingComponentSubscription: Subscription;
  protected failedToImportWork: boolean;
  protected importingWork: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public componentState: any,
    private conceptMapService: ConceptMapService,
    private dialogRef: MatDialogRef<GenerateImageDialogComponent>,
    private drawService: DrawService,
    private embeddedService: EmbeddedService,
    private graphService: GraphService,
    private labelService: LabelService,
    private nodeService: NodeService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.subscribeToDoneRenderingComponent();
    this.setDestroyTimeout();
  }

  private subscribeToDoneRenderingComponent(): void {
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

  private generateImage(): void {
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
  private setDestroyTimeout(): void {
    this.destroyDoneRenderingComponentListenerTimeout = setTimeout(() => {
      this.doneRenderingComponentSubscription.unsubscribe();
      this.setFailedToImportWork();
    }, 10000);
  }

  private setFailedToImportWork(): void {
    this.importingWork = false;
    this.failedToImportWork = true;
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  private getComponentService(componentType: string): any {
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
