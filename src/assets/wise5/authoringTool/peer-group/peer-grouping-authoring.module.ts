import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { AuthorPeerGroupingComponent } from './author-peer-grouping/author-peer-grouping.component';
import { SelectPeerGroupingComponent } from './select-peer-grouping/select-peer-grouping.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { NewPeerGroupingComponent } from './new-peer-grouping/new-peer-grouping.component';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    EditPeerGroupingDialogComponent,
    NewPeerGroupingComponent,
    AuthorPeerGroupingComponent,
    SelectPeerGroupingComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupAuthoringService]
})
export class PeerGroupAuthoringModule {}
