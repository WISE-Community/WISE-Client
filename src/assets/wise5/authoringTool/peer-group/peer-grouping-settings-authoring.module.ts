import { NgModule } from '@angular/core';
import { SelectPeerGroupSettingsOptionComponent } from './select-peer-group-settings-option/select-peer-group-settings-option.component';
import { SelectPeerGroupSettingsDialogComponent } from './select-peer-group-settings-dialog/select-peer-group-settings-dialog.component';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { EditPeerGroupSettingsDialogComponent } from './edit-peer-group-settings-dialog/edit-peer-group-settings-dialog.component';
import { CreateNewPeerGroupSettingsDialogComponent } from './create-new-peer-group-settings-dialog/create-new-peer-group-settings-dialog.component';
import { SelectPeerGroupSettingsAuthoringComponent } from './select-peer-group-settings-authoring/select-peer-group-settings-authoring.component';
import { PeerGroupSettingsAuthoringService } from '../../services/peerGroupSettingsAuthoringService';

@NgModule({
  imports: [AngularJSModule],
  declarations: [
    CreateNewPeerGroupSettingsDialogComponent,
    EditPeerGroupSettingsDialogComponent,
    SelectPeerGroupSettingsAuthoringComponent,
    SelectPeerGroupSettingsOptionComponent,
    SelectPeerGroupSettingsDialogComponent
  ],
  providers: [PeerGroupSettingsAuthoringService],
  exports: [SelectPeerGroupSettingsAuthoringComponent]
})
export class PeerGroupSettingsAuthoringModule {}
