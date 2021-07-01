import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import '../assets/wise5/teacher/teacher-angular-js-module';
import { AlertStatusCornerComponent } from './classroom-monitor/alert-status-corner/alert-status-corner.component';
import { UpgradeModule } from '@angular/upgrade/static';
import { setUpLocationSync } from '@angular/router/upgrade';
import { ProjectService } from '../assets/wise5/services/projectService';
import { MilestonesComponent } from './classroom-monitor/milestones/milestones.component';
import { MilestoneReportDataComponent } from './teacher/milestone/milestone-report-data/milestone-report-data.component';
import { TeacherProjectService } from '../assets/wise5/services/teacherProjectService';
import { ProjectAssetService } from './services/projectAssetService';
import { SpaceService } from '../assets/wise5/services/spaceService';
import { StudentStatusService } from '../assets/wise5/services/studentStatusService';
import { TeacherDataService } from '../assets/wise5/services/teacherDataService';
import { TeacherWebSocketService } from '../assets/wise5/services/teacherWebSocketService';
import { DataService } from './services/data.service';
import { MilestoneService } from '../assets/wise5/services/milestoneService';
import { WorkgroupNodeScoreComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupNodeStatusComponent } from './classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { NavItemScoreComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/navItemScore/nav-item-score.component';
import { ManageStudentsComponent } from '../assets/wise5/classroomMonitor/manageStudents/manage-students-component';
import { AdvancedProjectAuthoringComponent } from '../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { ChooseNewComponent } from './authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ChooseNewComponentLocation } from './authoring-tool/add-component/choose-new-component-location/choose-new-component-location.component';
import { AddYourOwnNode } from '../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from '../assets/wise5/authoringTool/addNode/choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from '../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { ChooseImportStepComponent } from './authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { ChooseImportStepLocationComponent } from './authoring-tool/import-step/choose-import-step-location/choose-import-step-location.component';
import { ComponentNewWorkBadgeComponent } from './classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { ComponentSelectComponent } from './classroom-monitor/component-select/component-select.component';
import { ComponentStateInfoComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/component-state-info/component-state-info.component';
import { StatusIconComponent } from './classroom-monitor/status-icon/status-icon.component';
import { StepInfoComponent } from './classroom-monitor/step-info/step-info.component';
import { AngularJSModule } from './common-hybrid-angular.module';
import { NodeAdvancedJsonAuthoringComponent } from '../assets/wise5/authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { WorkgroupInfoComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../assets/wise5/authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { WiseAuthoringTinymceEditorComponent } from '../assets/wise5/directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
import { EditComponentAnnotationsComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { EditComponentCommentComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentDefaultFeedback } from './authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentExcludeFromTotalScoreComponent } from './authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from './authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from './authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentPrompt } from './authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditComponentRubricComponent } from './authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from './authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentScoreComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { EditComponentSubmitButtonComponent } from './authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from './authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from './authoring-tool/edit-component-width/edit-component-width.component';
import { GradingEditComponentMaxScoreComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
import { RubricAuthoringComponent } from '../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { NavItemProgressComponent } from './classroom-monitor/nav-item-progress/nav-item-progress.component';
import { WorkgroupSelectDropdownComponent } from './classroom-monitor/workgroup-select/workgroup-select-dropdown/workgroup-select-dropdown.component';
import { WorkgroupSelectAutocompleteComponent } from './classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { EditHTMLAdvancedComponent } from '../assets/wise5/components/html/edit-html-advanced/edit-html-advanced.component';
import { EditOutsideUrlAdvancedComponent } from '../assets/wise5/components/outsideURL/edit-outside-url-advanced/edit-outside-url-advanced.component';
import { OpenResponseAuthoring } from '../assets/wise5/components/openResponse/open-response-authoring/open-response-authoring.component';
import { HtmlAuthoring } from '../assets/wise5/components/html/html-authoring/html-authoring.component';
import { OutsideUrlAuthoring } from '../assets/wise5/components/outsideURL/outside-url-authoring/outside-url-authoring.component';
import { MultipleChoiceAuthoring } from '../assets/wise5/components/multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { ConceptMapAuthoring } from '../assets/wise5/components/conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DrawAuthoring } from '../assets/wise5/components/draw/draw-authoring/draw-authoring.component';
import { MatchAuthoring } from '../assets/wise5/components/match/match-authoring/match-authoring.component';
import { LabelAuthoring } from '../assets/wise5/components/label/label-authoring/label-authoring.component';
import { TableAuthoring } from '../assets/wise5/components/table/table-authoring/table-authoring.component';
import { DiscussionAuthoring } from '../assets/wise5/components/discussion/discussion-authoring/discussion-authoring.component';
import { SummaryAuthoring } from '../assets/wise5/components/summary/summary-authoring/summary-authoring.component';
import { EmbeddedAuthoring } from '../assets/wise5/components/embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from '../assets/wise5/components/graph/graph-authoring/graph-authoring.component';
import { AudioOscillatorAuthoring } from '../assets/wise5/components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { AnimationAuthoring } from '../assets/wise5/components/animation/animation-authoring/animation-authoring.component';
import { OpenResponseGrading } from '../assets/wise5/components/openResponse/open-response-grading/open-response-grading.component';
import { MultipleChoiceGrading } from '../assets/wise5/components/multipleChoice/multiple-choice-grading/multiple-choice-grading.component';
import { MatchGrading } from '../assets/wise5/components/match/match-grading/match-grading.component';
import { LabelGrading } from '../assets/wise5/components/label/label-grading/label-grading.component';
import { DrawGrading } from '../assets/wise5/components/draw/draw-grading/draw-grading.component';
import { AudioOscillatorGrading } from '../assets/wise5/components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.component';
import { TableGrading } from '../assets/wise5/components/table/table-grading/table-grading.component';
import { ConceptMapGrading } from '../assets/wise5/components/conceptMap/concept-map-grading/concept-map-grading.component';
import { DiscussionGrading } from '../assets/wise5/components/discussion/discussion-grading/discussion-grading.component';
import { GraphGrading } from '../assets/wise5/components/graph/graph-grading/graph-grading.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnimationGrading } from '../assets/wise5/components/animation/animation-grading/animation-grading.component';
import { EmbeddedGrading } from '../assets/wise5/components/embedded/embedded-grading/embedded-grading.component';
import { StepToolsComponent } from '../assets/wise5/common/stepTools/step-tools.component';
import { NodeIconChooserDialog } from '../assets/wise5/common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { CopyNodesService } from '../assets/wise5/services/copyNodesService';
import { InsertNodesService } from '../assets/wise5/services/insertNodesService';
import { ViewComponentRevisionsComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/view-component-revisions/view-component-revisions.component';
import { WorkgroupComponentGradingComponent } from '../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';

@NgModule({
  declarations: [
    AddYourOwnNode,
    AdvancedProjectAuthoringComponent,
    AlertStatusCornerComponent,
    AnimationAuthoring,
    AnimationGrading,
    AudioOscillatorAuthoring,
    AudioOscillatorGrading,
    ChooseImportStepComponent,
    ChooseImportStepLocationComponent,
    ChooseNewComponent,
    ChooseNewComponentLocation,
    ChooseNewNodeLocation,
    ChooseNewNodeTemplate,
    ComponentNewWorkBadgeComponent,
    ComponentSelectComponent,
    ComponentStateInfoComponent,
    ConceptMapAuthoring,
    ConceptMapGrading,
    DrawAuthoring,
    DrawGrading,
    DiscussionAuthoring,
    DiscussionGrading,
    EditComponentAnnotationsComponent,
    EditComponentCommentComponent,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentRubricComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentPrompt,
    EditComponentTagsComponent,
    EditComponentSaveButtonComponent,
    EditComponentScoreComponent,
    EditComponentSubmitButtonComponent,
    EditComponentWidthComponent,
    EditHTMLAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EmbeddedAuthoring,
    EmbeddedGrading,
    GradingEditComponentMaxScoreComponent,
    GraphAuthoring,
    GraphGrading,
    HtmlAuthoring,
    LabelAuthoring,
    LabelGrading,
    ManageStudentsComponent,
    MatchAuthoring,
    MatchGrading,
    MilestonesComponent,
    MilestoneReportDataComponent,
    MultipleChoiceAuthoring,
    MultipleChoiceGrading,
    NavItemProgressComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeIconChooserDialog,
    OpenResponseGrading,
    OpenResponseAuthoring,
    OutsideUrlAuthoring,
    RubricAuthoringComponent,
    StatusIconComponent,
    StepInfoComponent,
    StepToolsComponent,
    SummaryAuthoring,
    TableAuthoring,
    TableGrading,
    ViewComponentRevisionsComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupSelectAutocompleteComponent,
    WorkgroupSelectDropdownComponent,
    NavItemScoreComponent,
    WiseAuthoringTinymceEditorComponent,
    WorkgroupNodeStatusComponent
  ],
  imports: [AngularJSModule, HighchartsChartModule, RouterModule],
  providers: [
    CopyNodesService,
    { provide: DataService, useExisting: TeacherDataService },
    InsertNodesService,
    MilestoneService,
    ProjectAssetService,
    SpaceService,
    StudentStatusService,
    { provide: ProjectService, useExisting: TeacherProjectService },
    TeacherDataService,
    TeacherProjectService,
    TeacherWebSocketService
  ]
})
export class TeacherAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    bootstrapAngularJSModule(upgrade, 'teacher');
  }
}

function bootstrapAngularJSModule(upgrade: UpgradeModule, moduleType: string) {
  upgrade.bootstrap(document.body, [moduleType]);
  setUpLocationSync(upgrade);
}
