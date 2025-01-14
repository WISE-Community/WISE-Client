import { Injectable } from '@angular/core';
import { NodeService } from './nodeService';
import { Subject, Observable } from 'rxjs';
import { TeacherDataService } from './teacherDataService';
import { TeacherProjectService } from './teacherProjectService';
import { ConfigService } from './configService';
import { ConstraintService } from './constraintService';

@Injectable()
export class TeacherNodeService extends NodeService {
  private componentShowSubmitButtonValueChangedSource: Subject<any> = new Subject<any>();
  public componentShowSubmitButtonValueChanged$: Observable<any> =
    this.componentShowSubmitButtonValueChangedSource.asObservable();
  private deleteStarterStateSource: Subject<any> = new Subject<any>();
  public deleteStarterState$: Observable<any> = this.deleteStarterStateSource.asObservable();
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();

  constructor(
    protected configService: ConfigService,
    protected constraintService: ConstraintService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, constraintService, dataService, projectService);
  }

  broadcastComponentShowSubmitButtonValueChanged(args: any): void {
    this.componentShowSubmitButtonValueChangedSource.next(args);
  }

  deleteStarterState(args: any): void {
    this.deleteStarterStateSource.next(args);
  }

  respondStarterState(args: any): void {
    this.starterStateResponseSource.next(args);
  }

  getPrevNodeId(currentId?: string): string {
    let prevNodeId = null;
    const currentNodeId = currentId ?? this.dataService.getCurrentNodeId();
    if (currentNodeId) {
      const currentNodeOrder = this.projectService.getNodeOrderById(currentNodeId);
      if (currentNodeOrder) {
        const prevId = this.projectService.getNodeIdByOrder(currentNodeOrder - 1);
        if (prevId) {
          prevNodeId = this.projectService.isApplicationNode(prevId)
            ? prevId
            : this.getPrevNodeId(prevId);
        }
      }
    }
    return prevNodeId;
  }

  getNextNodeId(currentId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let nextNodeId = null;
      const currentNodeId = currentId ?? this.dataService.getCurrentNodeId();
      const currentNodeOrder = this.projectService.getNodeOrderById(currentNodeId);
      if (currentNodeOrder) {
        const nextId = this.projectService.getNodeIdByOrder(currentNodeOrder + 1);
        if (nextId) {
          nextNodeId = this.projectService.isApplicationNode(nextId)
            ? nextId
            : this.getNextNodeId(nextId);
        }
      }
      resolve(nextNodeId);
    });
  }
}
