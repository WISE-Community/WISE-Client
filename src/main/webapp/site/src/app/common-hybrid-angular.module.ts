import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UpgradeModule } from '@angular/upgrade/static';
import { UtilService } from '../assets/wise5/services/utilService';
import { ConfigService } from '../assets/wise5/services/configService';
import { ProjectService } from '../assets/wise5/services/projectService';
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
import { WiseTinymceEditorComponent } from '../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

@Component({ template: `` })
export class EmptyComponent {}

@NgModule({
  declarations: [
    EmptyComponent,
    HelpIconComponent,
    NodeIconComponent,
    NodeStatusIcon,
    WiseTinymceEditorComponent
  ],
  imports: [
    UpgradeModule,
    CommonModule,
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
    MatSlideToggleModule,
    MatTooltipModule,
    MomentModule,
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
    ConfigService,
    CRaterService,
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
    { provide: ProjectService, useExisting: VLEProjectService },
    SessionService,
    StudentAssetService,
    StudentDataService,
    StudentWebSocketService,
    SummaryService,
    TableService,
    TagService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    UtilService,
    VLEProjectService
  ],
  exports: [
    CommonModule,
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
    MatSlideToggleModule,
    MatTooltipModule,
    MomentModule,
    NodeIconComponent,
    NodeStatusIcon,
    ReactiveFormsModule
  ]
})
export class AngularJSModule {}
