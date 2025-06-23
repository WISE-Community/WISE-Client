import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TimedNodeService {
  isNodeCompletedBroadcast: Subject<boolean> = new Subject<boolean>();

  broadcastIsNodeCompleted(isCompleted: boolean): void {
    this.isNodeCompletedBroadcast.next(isCompleted);
  }
}
