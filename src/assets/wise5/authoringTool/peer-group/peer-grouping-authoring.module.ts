import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { SelectPeerGroupingComponent } from './select-peer-grouping/select-peer-grouping.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    CreateNewPeerGroupingDialogComponent,
    EditPeerGroupingDialogComponent,
    SelectPeerGroupingComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupAuthoringService]
})
export class PeerGroupAuthoringModule {}
