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
}
