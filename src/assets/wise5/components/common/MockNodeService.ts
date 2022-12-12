import { Observable, Subject } from 'rxjs';

export class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
  private deleteStarterStateSource: Subject<any> = new Subject<any>();
  public deleteStarterState$: Observable<any> = this.deleteStarterStateSource.asObservable();
}
