import { NgModule } from '@angular/core';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option/select-peer-grouping-option.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring/select-peer-grouping-authoring.component';
import { PeerGroupingAuthoringService } from '../../services/peerGroupingAuthoringService';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    CreateNewPeerGroupingDialogComponent,
    EditPeerGroupingDialogComponent,
    SelectPeerGroupingAuthoringComponent,
    SelectPeerGroupingOptionComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupingAuthoringService],
  exports: [SelectPeerGroupingAuthoringComponent]
})
export class PeerGroupingAuthoringModule {}
