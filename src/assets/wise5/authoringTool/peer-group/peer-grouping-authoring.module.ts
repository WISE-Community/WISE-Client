import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';

@NgModule({
  declarations: [SelectPeerGroupingDialogComponent],
  providers: [PeerGroupAuthoringService]
})
export class PeerGroupAuthoringModule {}
