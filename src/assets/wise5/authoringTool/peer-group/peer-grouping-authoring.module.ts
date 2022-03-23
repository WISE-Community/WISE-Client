import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { PeerGroupingAuthoringComponent } from './peer-grouping-authoring/peer-grouping-authoring.component';
import { PeerGroupingDisplayComponent } from './peer-grouping-display/peer-grouping-display.component';
import { PeerGroupingSelectingComponent } from './peer-grouping-selecting/peer-grouping-selecting.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { NewPeerGroupingComponent } from './new-peer-grouping/new-peer-grouping.component';
import { EditPeerGroupingComponent } from './edit-peer-grouping/edit-peer-grouping.component';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    EditPeerGroupingComponent,
    NewPeerGroupingComponent,
    PeerGroupingAuthoringComponent,
    PeerGroupingDisplayComponent,
    PeerGroupingSelectingComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupAuthoringService]
})
export class PeerGroupAuthoringModule {}
