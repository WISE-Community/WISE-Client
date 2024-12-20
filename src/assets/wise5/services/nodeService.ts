import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { DataService } from '../../../app/services/data.service';
import { Observable, Subject } from 'rxjs';
import { ConstraintService } from './constraintService';

@Injectable()
export abstract class NodeService {
  private doneRenderingComponentSource: Subject<any> = new Subject<any>();
  public doneRenderingComponent$ = this.doneRenderingComponentSource.asObservable();
  private nodeSubmitClickedSource: Subject<any> = new Subject<any>();
  public nodeSubmitClicked$: Observable<any> = this.nodeSubmitClickedSource.asObservable();

  constructor(
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    protected dataService: DataService,
    protected dialog: MatDialog,
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

  closeNode(): void {
    const currentNode = this.dataService.getCurrentNode();
    if (currentNode) {
      const parentNode = this.projectService.getParentGroup(currentNode.id);
      this.setCurrentNode(parentNode.id);
    }
  }

  broadcastNodeSubmitClicked(args: any) {
    this.nodeSubmitClickedSource.next(args);
  }

  broadcastDoneRenderingComponent(nodeIdAndComponentId: any) {
    this.doneRenderingComponentSource.next(nodeIdAndComponentId);
  }
}
