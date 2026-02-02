import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectService } from '../../assets/wise5/services/projectService';

@Injectable()
export abstract class DataService {
  protected projectService = inject(ProjectService);

  currentNode = null;
  previousStep = null;
  private currentNodeChangedSource: Subject<any> = new Subject<any>();
  public currentNodeChanged$ = this.currentNodeChangedSource.asObservable();
  private studentWorkReceivedSource: Subject<any> = new Subject<any>();
  public studentWorkReceived$ = this.studentWorkReceivedSource.asObservable();

  getCurrentNode(): any {
    return this.currentNode;
  }

  getCurrentNodeId(): string {
    if (this.currentNode != null) {
      return this.currentNode.id;
    }
    return null;
  }

  getBranchPathTakenEventsByNodeId(currentNodeId): any[] {
    return [];
  }

  // refactor: this should be only in studentDataService
  saveVLEEvent(nodeId, componentId, componentType, category, event, eventData) {}

  // refactor: replace this with setCurrentNode()
  setCurrentNodeByNodeId(nodeId: string): void {
    this.setCurrentNode(this.projectService.getNodeById(nodeId));
  }

  setCurrentNode(node: any): void {
    const previousCurrentNode = this.currentNode;
    this.currentNode = node;
    if (previousCurrentNode !== node) {
      if (previousCurrentNode && !this.projectService.isGroupNode(previousCurrentNode.id)) {
        this.previousStep = previousCurrentNode;
      }
      this.currentNodeChangedSource.next({
        previousNode: previousCurrentNode,
        currentNode: this.currentNode
      });
    }
  }

  broadcastStudentWorkReceived(studentWork: any) {
    this.studentWorkReceivedSource.next(studentWork);
  }
}
