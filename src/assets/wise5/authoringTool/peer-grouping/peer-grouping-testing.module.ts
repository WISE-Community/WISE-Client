import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../services/configService';
import { PeerGroupingAuthoringService } from '../../services/peerGroupingAuthoringService';
import { SessionService } from '../../services/sessionService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { UtilService } from '../../services/utilService';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring/select-peer-grouping-authoring.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog/select-peer-grouping-dialog.component';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option/select-peer-grouping-option.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientTestingModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule,
    UpgradeModule
  ],
  declarations: [
    CreateNewPeerGroupingDialogComponent,
    EditPeerGroupingDialogComponent,
    SelectPeerGroupingAuthoringComponent,
    SelectPeerGroupingDialogComponent,
    SelectPeerGroupingOptionComponent
  ],
  providers: [
    ConfigService,
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    {
      provide: MatDialogRef,
      useValue: { close: () => {} }
    },
    PeerGroupingAuthoringService,
    SessionService,
    TeacherProjectService,
    UtilService
  ]
})
export class PeerGroupingTestingModule {}
