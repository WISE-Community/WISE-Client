import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option/select-peer-grouping-option.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring/select-peer-grouping-authoring.component';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    CreateNewPeerGroupingDialogComponent,
    EditPeerGroupingDialogComponent,
    SelectPeerGroupingAuthoringComponent,
    SelectPeerGroupingOptionComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupAuthoringService],
  exports: [SelectPeerGroupingAuthoringComponent]
})
export class PeerGroupAuthoringModule {}
