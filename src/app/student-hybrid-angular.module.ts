import { NgModule } from '@angular/core';

import { createStudentAngularJSModule } from '../assets/wise5/vle/student-angular-js-module';
import { bootstrapAngularJSModule } from './common-hybrid-angular.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from '../assets/wise5/services/projectService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { CommonModule } from '@angular/common';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { MatDialogModule } from '@angular/material/dialog';
import { ChooseBranchPathDialogComponent } from './preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DataService } from './services/data.service';
import { AngularJSModule } from './common-hybrid-angular.module';
import { NavItemComponent } from '../assets/wise5/vle/nav-item/nav-item.component';
import { HtmlDialog } from '../assets/wise5/directives/html-dialog/html-dialog';
import { MatchStudentModule } from '../assets/wise5/components/match/match-student/match-student.module';
import { StudentComponentModule } from './student/student.component.module';
import { SafeUrl } from '../assets/wise5/directives/safeUrl/safe-url.pipe';
import { HighchartsChartModule } from 'highcharts-angular';
import { DialogGuidanceStudentModule } from '../assets/wise5/components/dialogGuidance/dialogGuidanceStudentModule';
import { ComponentComponent } from '../assets/wise5/components/component/component.component';
import { StepToolsComponent } from '../assets/wise5/themes/default/themeComponents/stepTools/step-tools.component';
import { NavigationComponent } from '../assets/wise5/themes/default/navigation/navigation.component';
import { StudentAssetsModule } from '../assets/wise5/vle/studentAsset/student-assets/student-assets-module';
import { OpenResponseStudentModule } from '../assets/wise5/components/openResponse/open-response-student/open-response-student.module';
import { TableStudentModule } from '../assets/wise5/components/table/table-student/table-student.module';
import { MultipleChoiceStudentModule } from '../assets/wise5/components/multipleChoice/multiple-choice-student/multiple-choice-student.module';
import { LabelStudentModule } from '../assets/wise5/components/label/label-student/label-student.module';
import { ConceptMapStudentModule } from '../assets/wise5/components/conceptMap/concept-map-student/concept-map-student.module';
import { DrawStudentModule } from '../assets/wise5/components/draw/draw-student/draw-student-module';
import { DiscussionStudentModule } from '../assets/wise5/components/discussion/discussion-student/discussion-student.module';
import { GraphStudentModule } from '../assets/wise5/components/graph/graph-student/graph-student.module';
import { AnimationStudentModule } from '../assets/wise5/components/animation/animation-student/animation-student.module';
import { AudioOscillatorStudentModule } from '../assets/wise5/components/audioOscillator/audio-oscillator-student/audio-oscillator.module';
import { EmbeddedStudentModule } from '../assets/wise5/components/embedded/embedded-student/embedded-student.module';
import { HtmlStudentModule } from '../assets/wise5/components/html/html-student/html-student.module';
import { OutsideUrlStudentModule } from '../assets/wise5/components/outsideURL/outside-url-student/outside-url-student.module';
import { SummaryStudentModule } from '../assets/wise5/components/summary/summary-student/summary-student.module';
import { SummaryDisplayModule } from '../assets/wise5/directives/summaryDisplay/summary-display.module';
import { GenerateImageDialogComponent } from '../assets/wise5/directives/generate-image-dialog/generate-image-dialog.component';
import { NotificationsMenuComponent } from '../assets/wise5/vle/notifications-menu/notifications-menu.component';
import { StudentAccountMenuComponent } from '../assets/wise5/vle/student-account-menu/student-account-menu.component';

@NgModule({
  declarations: [
    ComponentComponent,
    GenerateImageDialogComponent,
    HtmlDialog,
    NavigationComponent,
    NavItemComponent,
    NotificationsMenuComponent,
    SafeUrl,
    StepToolsComponent,
    StudentAccountMenuComponent
  ],
  imports: [
    AngularJSModule,
    AnimationStudentModule,
    AudioOscillatorStudentModule,
    ConceptMapStudentModule,
    DialogGuidanceStudentModule,
    DiscussionStudentModule,
    DrawStudentModule,
    EmbeddedStudentModule,
    GraphStudentModule,
    HighchartsChartModule,
    HtmlStudentModule,
    LabelStudentModule,
    MatchStudentModule,
    MultipleChoiceStudentModule,
    OpenResponseStudentModule,
    OutsideUrlStudentModule,
    StudentAssetsModule,
    StudentComponentModule,
    SummaryDisplayModule,
    SummaryStudentModule,
    TableStudentModule
  ],
  providers: [
    { provide: DataService, useExisting: StudentDataService },
    { provide: ProjectService, useExisting: VLEProjectService },
    VLEProjectService
  ],
  exports: [CommonModule, MatButtonModule, MatDialogModule, MatListModule]
})
export class StudentAngularJSModule {}

@NgModule({
  declarations: [ChooseBranchPathDialogComponent],
  imports: [StudentAngularJSModule]
})
export class StudentVLEAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    createStudentAngularJSModule('vle');
    bootstrapAngularJSModule(upgrade, 'vle');
  }
}

@NgModule({
  imports: [StudentAngularJSModule]
})
export class PreviewAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    createStudentAngularJSModule('preview');
    bootstrapAngularJSModule(upgrade, 'preview');
  }
}
