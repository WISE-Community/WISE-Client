import { Injectable } from '@angular/core';
import { NodeService } from './nodeService';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TeacherNodeService extends NodeService {
  private componentShowSubmitButtonValueChangedSource: Subject<any> = new Subject<any>();
  public componentShowSubmitButtonValueChanged$: Observable<any> = this.componentShowSubmitButtonValueChangedSource.asObservable();
  private deleteStarterStateSource: Subject<any> = new Subject<any>();
  public deleteStarterState$: Observable<any> = this.deleteStarterStateSource.asObservable();
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();

  broadcastComponentShowSubmitButtonValueChanged(args: any): void {
    this.componentShowSubmitButtonValueChangedSource.next(args);
  }

  deleteStarterState(args: any): void {
    this.deleteStarterStateSource.next(args);
  }

  respondStarterState(args: any): void {
    this.starterStateResponseSource.next(args);
  }

  getNextNodeId(currentId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let nextNodeId = null;
      const currentNodeId = currentId ?? this.DataService.getCurrentNodeId();
      const currentNodeOrder = this.ProjectService.getNodeOrderById(currentNodeId);
      if (currentNodeOrder) {
        const nextId = this.ProjectService.getNodeIdByOrder(currentNodeOrder + 1);
        if (nextId) {
          nextNodeId = this.ProjectService.isApplicationNode(nextId)
            ? nextId
            : this.getNextNodeId(nextId);
        }
      }
      resolve(nextNodeId);
    });
  }
}
