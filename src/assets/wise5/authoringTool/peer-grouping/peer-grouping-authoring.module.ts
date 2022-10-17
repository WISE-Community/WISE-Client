import { NgModule } from '@angular/core';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option/select-peer-grouping-option.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring/select-peer-grouping-authoring.component';
import { PeerGroupingAuthoringService } from '../../services/peerGroupingAuthoringService';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  imports: [StudentTeacherCommonModule],
  declarations: [
    SelectPeerGroupingAuthoringComponent,
    SelectPeerGroupingOptionComponent,
    SelectPeerGroupingDialogComponent
  ],
  providers: [PeerGroupingAuthoringService],
  exports: [SelectPeerGroupingAuthoringComponent]
})
export class PeerGroupingAuthoringModule {}
