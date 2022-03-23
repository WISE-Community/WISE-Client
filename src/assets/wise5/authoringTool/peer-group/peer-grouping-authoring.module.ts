import { NgModule } from '@angular/core';
import { PeerGroupAuthoringService } from '../../services/peerGroupAuthoringService';
import { AuthorPeerGroupingComponent } from './author-peer-grouping/author-peer-grouping.component';
import { DisplayPeerGroupingComponent } from './display-peer-grouping/display-peer-grouping.component';
import { SelectPeerGroupingComponent } from './select-peer-grouping/select-peer-grouping.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { NewPeerGroupingComponent } from './new-peer-grouping/new-peer-grouping.component';
import { EditPeerGroupingComponent } from './edit-peer-grouping/edit-peer-grouping.component';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    EditPeerGroupingComponent,
    NewPeerGroupingComponent,
    AuthorPeerGroupingComponent,
    DisplayPeerGroupingComponent,
    SelectPeerGroupingComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupAuthoringService]
})
export class PeerGroupAuthoringModule {}
