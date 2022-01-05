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
import { HtmlStudent } from '../assets/wise5/components/html/html-student/html-student.component';
import { MultipleChoiceStudent } from '../assets/wise5/components/multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { OutsideUrlStudent } from '../assets/wise5/components/outsideURL/outside-url-student/outside-url-student.component';
import { AudioOscillatorStudent } from '../assets/wise5/components/audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { LabelStudent } from '../assets/wise5/components/label/label-student/label-student.component';
import { DrawStudent } from '../assets/wise5/components/draw/draw-student/draw-student.component';
import { ConceptMapStudent } from '../assets/wise5/components/conceptMap/concept-map-student/concept-map-student.component';
import { HtmlDialog } from '../assets/wise5/directives/html-dialog/html-dialog';
import { MatchStudentModule } from '../assets/wise5/components/match/match-student/match-student.module';
import { StudentComponentModule } from './student/student.component.module';
import { AnimationStudent } from '../assets/wise5/components/animation/animation-student/animation-student.component';
import { EmbeddedStudent } from '../assets/wise5/components/embedded/embedded-student/embedded-student.component';
import { OpenResponseStudent } from '../assets/wise5/components/openResponse/open-response-student/open-response-student.component';
import { SafeUrl } from '../assets/wise5/directives/safeUrl/safe-url.pipe';
import { TableStudent } from '../assets/wise5/components/table/table-student/table-student.component';
import { DiscussionStudent } from '../assets/wise5/components/discussion/discussion-student/discussion-student.component';
import { SummaryStudent } from '../assets/wise5/components/summary/summary-student/summary-student.component';
import { SummaryDisplay } from '../assets/wise5/directives/summaryDisplay/summary-display.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { GraphStudent } from '../assets/wise5/components/graph/graph-student/graph-student.component';
import { DialogGuidanceStudentModule } from '../assets/wise5/components/dialogGuidance/dialogGuidanceStudentModule';
import { StudentAssetsComponent } from '../assets/wise5/vle/studentAsset/student-assets/student-assets.component';
import { DragAndDropDirective } from '../assets/wise5/common/drag-and-drop/drag-and-drop.directive';

@NgModule({
  declarations: [
    AnimationStudent,
    AudioOscillatorStudent,
    ConceptMapStudent,
    DiscussionStudent,
    DragAndDropDirective,
    DrawStudent,
    EmbeddedStudent,
    GraphStudent,
    HtmlDialog,
    HtmlStudent,
    LabelStudent,
    MultipleChoiceStudent,
    NavItemComponent,
    OpenResponseStudent,
    OutsideUrlStudent,
    SafeUrl,
    TableStudent,
    NavItemComponent,
    StudentAssetsComponent,
    SummaryDisplay,
    SummaryStudent
  ],
  imports: [
    AngularJSModule,
    DialogGuidanceStudentModule,
    HighchartsChartModule,
    MatchStudentModule,
    StudentComponentModule
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
