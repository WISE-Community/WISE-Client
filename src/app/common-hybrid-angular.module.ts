import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UpgradeModule } from '@angular/upgrade/static';
import { UtilService } from '../assets/wise5/services/utilService';
import { ConfigService } from '../assets/wise5/services/configService';
import { ProjectService } from '../assets/wise5/services/projectService';
import { ProjectLibraryService } from '../assets/wise5/services/projectLibraryService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { CRaterService } from '../assets/wise5/services/cRaterService';
import { SessionService } from '../assets/wise5/services/sessionService';
import { StudentAssetService } from '../assets/wise5/services/studentAssetService';
import { TagService } from '../assets/wise5/services/tagService';
import { AudioRecorderService } from '../assets/wise5/services/audioRecorderService';
import { AnnotationService } from '../assets/wise5/services/annotationService';
import { CommonModule } from '@angular/common';
import { StudentWebSocketService } from '../assets/wise5/services/studentWebSocketService';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { AchievementService } from '../assets/wise5/services/achievementService';
import { SummaryService } from '../assets/wise5/components/summary/summaryService';
import { TableService } from '../assets/wise5/components/table/tableService';
import { NotebookService } from '../assets/wise5/services/notebookService';
import { NotificationService } from '../assets/wise5/services/notificationService';
import { OutsideURLService } from '../assets/wise5/components/outsideURL/outsideURLService';
import { MatchService } from '../assets/wise5/components/match/matchService';
import { MultipleChoiceService } from '../assets/wise5/components/multipleChoice/multipleChoiceService';
import { OpenResponseService } from '../assets/wise5/components/openResponse/openResponseService';
import { NodeService } from '../assets/wise5/services/nodeService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DiscussionService } from '../assets/wise5/components/discussion/discussionService';
import { DrawService } from '../assets/wise5/components/draw/drawService';
import { EmbeddedService } from '../assets/wise5/components/embedded/embeddedService';
import { HTMLService } from '../assets/wise5/components/html/htmlService';
import { LabelService } from '../assets/wise5/components/label/labelService';
import { AnimationService } from '../assets/wise5/components/animation/animationService';
import { AudioOscillatorService } from '../assets/wise5/components/audioOscillator/audioOscillatorService';
import { ConceptMapService } from '../assets/wise5/components/conceptMap/conceptMapService';
import { GraphService } from '../assets/wise5/components/graph/graphService';
import { NodeIconComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/nodeIcon/node-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { HelpIconComponent } from '../assets/wise5/themes/default/themeComponents/helpIcon/help-icon.component';
import { NodeStatusIcon } from '../assets/wise5/themes/default/themeComponents/nodeStatusIcon/node-status-icon.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentService } from '../assets/wise5/components/componentService';
import { WiseLinkService } from './services/wiseLinkService';
import { DataExportService } from '../assets/wise5/services/dataExportService';
import { MatChipsModule } from '@angular/material/chips';
import { NotebookModule } from './notebook/notebook.module';
import { MatSliderModule } from '@angular/material/slider';
import { setUpLocationSync } from '@angular/router/upgrade';
import { DialogGuidanceService } from '../assets/wise5/components/dialogGuidance/dialogGuidanceService';
import { DialogResponseComponent } from '../assets/wise5/components/dialogGuidance/dialog-response/dialog-response.component';
import { DialogResponsesComponent } from '../assets/wise5/components/dialogGuidance/dialog-responses/dialog-responses.component';
import { ComputerAvatarService } from '../assets/wise5/services/computerAvatarService';

@Component({ template: `` })
export class EmptyComponent {}

@NgModule({
  declarations: [
    DialogResponseComponent,
    DialogResponsesComponent,
    EmptyComponent,
    HelpIconComponent,
    NodeIconComponent,
    NodeStatusIcon
  ],
  imports: [
    UpgradeModule,
    CommonModule,
    DragDropModule,
    EditorModule,
    FlexLayoutModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MomentModule,
    NotebookModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '**', component: EmptyComponent }])
  ],
  providers: [
    AchievementService,
    AnimationService,
    AnnotationService,
    AudioOscillatorService,
    AudioRecorderService,
    ConceptMapService,
    ComponentService,
    ComputerAvatarService,
    ConfigService,
    CRaterService,
    DataExportService,
    DialogGuidanceService,
    DiscussionService,
    DrawService,
    EmbeddedService,
    GraphService,
    HTMLService,
    LabelService,
    MatchService,
    MultipleChoiceService,
    NodeService,
    NotebookService,
    NotificationService,
    OutsideURLService,
    OpenResponseService,
    ProjectLibraryService,
    { provide: ProjectService, useExisting: VLEProjectService },
    SessionService,
    StudentAssetService,
    StudentDataService,
    StudentWebSocketService,
    SummaryService,
    TableService,
    TagService,
    UtilService,
    VLEProjectService,
    WiseLinkService
  ],
  exports: [
    CommonModule,
    DialogResponseComponent,
    DialogResponsesComponent,
    DragDropModule,
    EditorModule,
    FlexLayoutModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MomentModule,
    NodeIconComponent,
    NodeStatusIcon,
    ReactiveFormsModule
  ]
})
export class AngularJSModule {}

export function bootstrapAngularJSModule(upgrade: UpgradeModule, moduleType: string) {
  upgrade.bootstrap(document.body, [moduleType]);
  setUpLocationSync(upgrade);
}
