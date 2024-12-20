import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { DataService } from '../../../app/services/data.service';
import { Observable, Subject } from 'rxjs';
import { ConstraintService } from './constraintService';

@Injectable()
export abstract class NodeService {
  private nodeSubmitClickedSource: Subject<any> = new Subject<any>();
  public nodeSubmitClicked$: Observable<any> = this.nodeSubmitClickedSource.asObservable();
  private doneRenderingComponentSource: Subject<any> = new Subject<any>();
  public doneRenderingComponent$ = this.doneRenderingComponentSource.asObservable();

  constructor(
    protected dataService: DataService,
    protected dialog: MatDialog,
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    protected projectService: ProjectService
  ) {}

  setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }

  goToNextNode(): Promise<string> {
    return this.getNextNodeId().then((nextNodeId: string) => {
      if (nextNodeId != null) {
        this.setCurrentNode(nextNodeId);
      }
      return nextNodeId;
    });
  }

  abstract getNextNodeId(currentId?: string): Promise<any>;

  goToPrevNode(): void {
    this.setCurrentNode(this.getPrevNodeId());
  }

  abstract getPrevNodeId(currentId?: string): string;

  /**
   * Close the current node (and open the current node's parent group)
   */
  closeNode() {
    let currentNode = null;
    currentNode = this.dataService.getCurrentNode();
    if (currentNode) {
      let currentNodeId = currentNode.id;
      let parentNode = this.projectService.getParentGroup(currentNodeId);
      let parentNodeId = parentNode.id;
      this.setCurrentNode(parentNodeId);
    }
  }

  broadcastNodeSubmitClicked(args: any) {
    this.nodeSubmitClickedSource.next(args);
  }

  broadcastDoneRenderingComponent(nodeIdAndComponentId: any) {
    this.doneRenderingComponentSource.next(nodeIdAndComponentId);
  }
}
