import { NgModule } from '@angular/core';
import { AnimationAuthoring } from '../../assets/wise5/components/animation/animation-authoring/animation-authoring.component';
import { AudioOscillatorAuthoring } from '../../assets/wise5/components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from '../../assets/wise5/components/conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DialogGuidanceAuthoringComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DiscussionAuthoring } from '../../assets/wise5/components/discussion/discussion-authoring/discussion-authoring.component';
import { DrawAuthoring } from '../../assets/wise5/components/draw/draw-authoring/draw-authoring.component';
import { EmbeddedAuthoring } from '../../assets/wise5/components/embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from '../../assets/wise5/components/graph/graph-authoring/graph-authoring.component';
import { HtmlAuthoringComponent } from '../../assets/wise5/components/html/html-authoring/html-authoring.component';
import { LabelAuthoring } from '../../assets/wise5/components/label/label-authoring/label-authoring.component';
import { MatchAuthoringComponent } from '../../assets/wise5/components/match/match-authoring/match-authoring.component';
import { MultipleChoiceAuthoring } from '../../assets/wise5/components/multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { OpenResponseAuthoringComponent } from '../../assets/wise5/components/openResponse/open-response-authoring/open-response-authoring.component';
import { OutsideUrlAuthoring } from '../../assets/wise5/components/outsideURL/outside-url-authoring/outside-url-authoring.component';
import { SummaryAuthoring } from '../../assets/wise5/components/summary/summary-authoring/summary-authoring.component';
import { TableAuthoring } from '../../assets/wise5/components/table/table-authoring/table-authoring.component';
import { EditComponentDefaultFeedback } from '../authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentSaveButtonComponent } from '../authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../authoring-tool/edit-component-width/edit-component-width.component';
import { EditConnectedComponentsComponent } from '../authoring-tool/edit-connected-components/edit-connected-components.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';
import { EditComponentMaxSubmitComponent } from '../authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentAddToNotebookButtonComponent } from '../authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { PeerChatAuthoringComponent } from '../../assets/wise5/components/peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { ShowMyWorkAuthoringComponent } from '../../assets/wise5/components/showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { ShowGroupWorkAuthoringComponent } from '../../assets/wise5/components/showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { EditDialogGuidanceComputerAvatarComponent } from '../../assets/wise5/components/dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { PeerGroupingAuthoringModule } from '../../assets/wise5/authoringTool/peer-grouping/peer-grouping-authoring.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { SelectStepAndComponentComponent } from '../authoring-tool/select-step-and-component/select-step-and-component.component';
import { EditComponentConstraintsComponent } from '../authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { EditComponentAdvancedComponent } from '../authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { TranslatableInputComponent } from '../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { TranslatableTextareaComponent } from '../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableRichTextEditorComponent } from '../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { TranslatableAssetChooserComponent } from '../../assets/wise5/authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { AiChatAuthoringComponent } from '../../assets/wise5/components/aiChat/ai-chat-authoring/ai-chat-authoring.component';

@NgModule({
  imports: [
    AiChatAuthoringComponent,
    AnimationAuthoring,
    AudioOscillatorAuthoring,
    ConceptMapAuthoring,
    DiscussionAuthoring,
    DrawAuthoring,
    DialogGuidanceAuthoringComponent,
    EditComponentAdvancedComponent,
    EditConnectedComponentsWithBackgroundComponent,
    EditDialogGuidanceComputerAvatarComponent,
    EditComponentAddToNotebookButtonComponent,
    EditComponentConstraintsComponent,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentMaxSubmitComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditComponentWidthComponent,
    EditConnectedComponentsComponent,
    EmbeddedAuthoring,
    GraphAuthoring,
    LabelAuthoring,
    OutsideUrlAuthoring,
    PeerChatAuthoringComponent,
    ShowGroupWorkAuthoringComponent,
    ShowMyWorkAuthoringComponent,
    SummaryAuthoring,
    TableAuthoring,
    HtmlAuthoringComponent,
    MatchAuthoringComponent,
    MultipleChoiceAuthoring,
    OpenResponseAuthoringComponent,
    PeerGroupingAuthoringModule,
    SelectStepAndComponentComponent,
    StudentTeacherCommonModule,
    TranslatableAssetChooserComponent,
    TranslatableInputComponent,
    TranslatableRichTextEditorComponent,
    TranslatableTextareaComponent
  ]
})
export class ComponentAuthoringModule {}
