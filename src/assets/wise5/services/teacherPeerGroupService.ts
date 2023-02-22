import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { PeerGroupDialogComponent } from '../classroomMonitor/classroomMonitorComponents/peer-group/peer-group-dialog/peer-group-dialog.component';
import { PeerGroup } from '../components/peerChat/PeerGroup';
import { ConfigService } from './configService';
import { PeerGroupService } from './peerGroupService';

@Injectable()
export class TeacherPeerGroupService extends PeerGroupService {
  constructor(
    protected configService: ConfigService,
    private dialog: MatDialog,
    protected http: HttpClient
  ) {
    super(configService, http);
  }

  showPeerGroupDetails(peerGroupingTag: string): void {
    this.dialog.open(PeerGroupDialogComponent, {
      data: peerGroupingTag,
      panelClass: 'dialog-lg'
    });
  }

  retrievePeerGroup(): Observable<PeerGroup> {
    return of(this.getPreviewPeerGroup());
  }

  retrievePeerGroupWork(): Observable<any> {
    return of([]);
  }

  retrieveStudentWork(): Observable<any> {
    return of([]);
  }
}
