import { NgModule } from '@angular/core';
import { AnimationAuthoring } from '../../assets/wise5/components/animation/animation-authoring/animation-authoring.component';
import { AudioOscillatorAuthoring } from '../../assets/wise5/components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from '../../assets/wise5/components/conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DialogGuidanceAuthoringComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { EditFeedbackRulesComponent } from '../../assets/wise5/components/common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { DiscussionAuthoring } from '../../assets/wise5/components/discussion/discussion-authoring/discussion-authoring.component';
import { DrawAuthoring } from '../../assets/wise5/components/draw/draw-authoring/draw-authoring.component';
import { EmbeddedAuthoring } from '../../assets/wise5/components/embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from '../../assets/wise5/components/graph/graph-authoring/graph-authoring.component';
import { EditHTMLAdvancedComponent } from '../../assets/wise5/components/html/edit-html-advanced/edit-html-advanced.component';
import { HtmlAuthoring } from '../../assets/wise5/components/html/html-authoring/html-authoring.component';
import { LabelAuthoring } from '../../assets/wise5/components/label/label-authoring/label-authoring.component';
import { MatchAuthoring } from '../../assets/wise5/components/match/match-authoring/match-authoring.component';
import { MultipleChoiceAuthoring } from '../../assets/wise5/components/multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { OpenResponseAuthoring } from '../../assets/wise5/components/openResponse/open-response-authoring/open-response-authoring.component';
import { EditOutsideUrlAdvancedComponent } from '../../assets/wise5/components/outsideURL/edit-outside-url-advanced/edit-outside-url-advanced.component';
import { OutsideUrlAuthoring } from '../../assets/wise5/components/outsideURL/outside-url-authoring/outside-url-authoring.component';
import { SummaryAuthoring } from '../../assets/wise5/components/summary/summary-authoring/summary-authoring.component';
import { TableAuthoring } from '../../assets/wise5/components/table/table-authoring/table-authoring.component';
import { AuthorUrlParametersComponent } from '../authoring-tool/author-url-parameters/author-url-parameters.component';
import { EditComponentDefaultFeedback } from '../authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentPrompt } from '../authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditComponentRubricComponent } from '../authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../authoring-tool/edit-component-width/edit-component-width.component';
import { EditConnectedComponentDefaultSelectsComponent } from '../authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentsAddButtonComponent } from '../authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentDeleteButtonComponent } from '../authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentTypeSelectComponent } from '../authoring-tool/edit-connected-component-type-select/edit-connected-component-type-select.component';
import { EditConnectedComponentsComponent } from '../authoring-tool/edit-connected-components/edit-connected-components.component';
import { EditConceptMapConnectedComponentsComponent } from '../../assets/wise5/components/conceptMap/edit-concept-map-connected-components/edit-concept-map-connected-components.component';
import { EditDrawConnectedComponentsComponent } from '../../assets/wise5/components/draw/edit-draw-connected-components/edit-draw-connected-components.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';
import { EditGraphConnectedComponentsComponent } from '../../assets/wise5/components/graph/edit-graph-connected-components/edit-graph-connected-components.component';
import { EditLabelConnectedComponentsComponent } from '../../assets/wise5/components/label/edit-label-connected-components/edit-label-connected-components.component';
import { EditTableConnectedComponentsComponent } from '../../assets/wise5/components/table/edit-table-connected-components/edit-table-connected-components.component';
import { EditDiscussionConnectedComponentsComponent } from '../../assets/wise5/components/discussion/edit-discussion-connected-components/edit-discussion-connected-components.component';
import { EditMatchConnectedComponentsComponent } from '../../assets/wise5/components/match/edit-match-connected-components/edit-match-connected-components.component';
import { EditMultipleChoiceConnectedComponentsComponent } from '../../assets/wise5/components/multipleChoice/edit-multiple-choice-connected-components/edit-multiple-choice-connected-components.component';
import { EditComponentMaxSubmitComponent } from '../authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditAnimationAdvancedComponent } from '../../assets/wise5/components/animation/edit-animation-advanced/edit-animation-advanced.component';
import { EditAudioOscillatorAdvancedComponent } from '../../assets/wise5/components/audioOscillator/edit-audio-oscillator-advanced/edit-audio-oscillator-advanced.component';
import { EditCommonAdvancedComponent } from '../authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditConceptMapAdvancedComponent } from '../../assets/wise5/components/conceptMap/edit-concept-map-advanced/edit-concept-map-advanced.component';
import { EditDiscussionAdvancedComponent } from '../../assets/wise5/components/discussion/edit-discussion-advanced/edit-discussion-advanced.component';
import { EditDrawAdvancedComponent } from '../../assets/wise5/components/draw/edit-draw-advanced/edit-draw-advanced.component';
import { EditEmbeddedAdvancedComponent } from '../../assets/wise5/components/embedded/edit-embedded-advanced/edit-embedded-advanced.component';
import { EditComponentAddToNotebookButtonComponent } from '../authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditGraphAdvancedComponent } from '../../assets/wise5/components/graph/edit-graph-advanced/edit-graph-advanced.component';
import { EditLabelAdvancedComponent } from '../../assets/wise5/components/label/edit-label-advanced/edit-label-advanced.component';
import { EditMultipleChoiceAdvancedComponent } from '../../assets/wise5/components/multipleChoice/edit-multiple-choice-advanced/edit-multiple-choice-advanced.component';
import { EditOpenResponseAdvancedComponent } from '../../assets/wise5/components/openResponse/edit-open-response-advanced/edit-open-response-advanced.component';
import { EditMatchAdvancedComponent } from '../../assets/wise5/components/match/edit-match-advanced/edit-match-advanced.component';
import { EditSummaryAdvancedComponent } from '../../assets/wise5/components/summary/edit-summary-advanced/edit-summary-advanced.component';
import { EditTableAdvancedComponent } from '../../assets/wise5/components/table/edit-table-advanced/edit-table-advanced.component';
import { EditPeerChatAdvancedComponentComponent } from '../../assets/wise5/components/peerChat/edit-peer-chat-advanced-component/edit-peer-chat-advanced-component.component';
import { PeerChatAuthoringComponent } from '../../assets/wise5/components/peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { ShowMyWorkAuthoringComponent } from '../../assets/wise5/components/showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { ShowGroupWorkAuthoringComponent } from '../../assets/wise5/components/showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { EditComponentPeerGroupingTagComponent } from '../authoring-tool/edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { EditDialogGuidanceAdvancedComponent } from '../../assets/wise5/components/dialogGuidance/edit-dialog-guidance-advanced/edit-dialog-guidance-advanced.component';
import { EditDialogGuidanceComputerAvatarComponent } from '../../assets/wise5/components/dialogGuidance/edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { PeerGroupingAuthoringModule } from '../../assets/wise5/authoringTool/peer-grouping/peer-grouping-authoring.module';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { FeedbackRuleHelpComponent } from '../../assets/wise5/components/common/feedbackRule/feedback-rule-help/feedback-rule-help.component';
import { EditDynamicPromptComponent } from '../authoring-tool/edit-dynamic-prompt/edit-dynamic-prompt.component';
import { EditDynamicPromptRulesComponent } from '../authoring-tool/edit-dynamic-prompt-rules/edit-dynamic-prompt-rules.component';
import { EditPeerGroupingDialogComponent } from '../../assets/wise5/authoringTool/peer-grouping/edit-peer-grouping-dialog/edit-peer-grouping-dialog.component';
import { CreateNewPeerGroupingDialogComponent } from '../../assets/wise5/authoringTool/peer-grouping/create-new-peer-grouping-dialog/create-new-peer-grouping-dialog.component';
import { EditQuestionBankComponent } from '../authoring-tool/edit-question-bank/edit-question-bank.component';
import { EditQuestionBankRulesComponent } from '../authoring-tool/edit-question-bank-rules/edit-question-bank-rules.component';
import { SelectStepAndComponentComponent } from '../authoring-tool/select-step-and-component/select-step-and-component.component';
import { EditComponentConstraintsComponent } from '../authoring-tool/edit-component-constraints/edit-component-constraints.component';
import { ComponentConstraintAuthoringComponent } from '../../assets/wise5/authoringTool/constraint/component-constraint-authoring/component-constraint-authoring.component';
import { EditComponentAdvancedComponent } from '../authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { ComponentAuthoringComponent } from '../../assets/wise5/authoringTool/components/component-authoring.component';
import { WiseTinymceEditorModule } from '../../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.module';
import { WiseLinkAuthoringDialogComponent } from '../../assets/wise5/authoringTool/wise-link-authoring-dialog/wise-link-authoring-dialog.component';
import { EditComponentAdvancedButtonComponent } from '../../assets/wise5/authoringTool/components/edit-component-advanced-button/edit-component-advanced-button.component';
import { TranslatableInputComponent } from '../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { TranslatableTextareaComponent } from '../../assets/wise5/authoringTool/components/translatable-textarea/translatable-textarea.component';
import { TranslatableRichTextEditorComponent } from '../../assets/wise5/authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';
import { TranslatableAssetChooserComponent } from '../../assets/wise5/authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { AiChatAuthoringComponent } from '../../assets/wise5/components/aiChat/ai-chat-authoring/ai-chat-authoring.component';
import { EditAiChatAdvancedComponent } from '../../assets/wise5/components/aiChat/edit-ai-chat-advanced/edit-ai-chat-advanced.component';
import { RequiredErrorLabelComponent } from '../../assets/wise5/authoringTool/node/advanced/required-error-label/required-error-label.component';

@NgModule({
  declarations: [
    AiChatAuthoringComponent,
    AnimationAuthoring,
    AudioOscillatorAuthoring,
    AuthorUrlParametersComponent,
    ConceptMapAuthoring,
    CreateNewPeerGroupingDialogComponent,
    DrawAuthoring,
    DialogGuidanceAuthoringComponent,
    DiscussionAuthoring,
    EditAiChatAdvancedComponent,
    EditAnimationAdvancedComponent,
    EditAudioOscillatorAdvancedComponent,
    EditCommonAdvancedComponent,
    EditComponentAdvancedComponent,
    EditComponentAddToNotebookButtonComponent,
    EditComponentConstraintsComponent,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentMaxSubmitComponent,
    EditComponentPeerGroupingTagComponent,
    EditComponentPrompt,
    EditComponentRubricComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditConceptMapAdvancedComponent,
    EditConceptMapConnectedComponentsComponent,
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentsComponent,
    EditConnectedComponentsWithBackgroundComponent,
    EditConnectedComponentDeleteButtonComponent,
    EditConnectedComponentTypeSelectComponent,
    EditDialogGuidanceAdvancedComponent,
    EditDialogGuidanceComputerAvatarComponent,
    EditDiscussionAdvancedComponent,
    EditDiscussionConnectedComponentsComponent,
    EditDrawAdvancedComponent,
    EditDrawConnectedComponentsComponent,
    EditDynamicPromptComponent,
    EditDynamicPromptRulesComponent,
    EditEmbeddedAdvancedComponent,
    EditFeedbackRulesComponent,
    EditGraphAdvancedComponent,
    EditGraphConnectedComponentsComponent,
    EditLabelAdvancedComponent,
    EditLabelConnectedComponentsComponent,
    EditHTMLAdvancedComponent,
    EditMatchAdvancedComponent,
    EditMatchConnectedComponentsComponent,
    EditMultipleChoiceAdvancedComponent,
    EditMultipleChoiceConnectedComponentsComponent,
    EditOpenResponseAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EditPeerChatAdvancedComponentComponent,
    EditPeerGroupingDialogComponent,
    EditQuestionBankComponent,
    EditQuestionBankRulesComponent,
    EditSummaryAdvancedComponent,
    EditTableAdvancedComponent,
    EditTableConnectedComponentsComponent,
    EmbeddedAuthoring,
    FeedbackRuleHelpComponent,
    GraphAuthoring,
    HtmlAuthoring,
    LabelAuthoring,
    MatchAuthoring,
    MultipleChoiceAuthoring,
    OpenResponseAuthoring,
    OutsideUrlAuthoring,
    PeerChatAuthoringComponent,
    ShowGroupWorkAuthoringComponent,
    ShowMyWorkAuthoringComponent,
    SummaryAuthoring,
    TableAuthoring,
    WiseLinkAuthoringDialogComponent
  ],
  imports: [
    ComponentAuthoringComponent,
    ComponentConstraintAuthoringComponent,
    EditComponentAdvancedButtonComponent,
    EditComponentWidthComponent,
    PeerGroupingAuthoringModule,
    RequiredErrorLabelComponent,
    SelectStepAndComponentComponent,
    StudentTeacherCommonModule,
    TranslatableAssetChooserComponent,
    TranslatableInputComponent,
    TranslatableRichTextEditorComponent,
    TranslatableTextareaComponent,
    WiseTinymceEditorModule
  ],
  exports: [
    AiChatAuthoringComponent,
    AudioOscillatorAuthoring,
    ComponentAuthoringComponent,
    ConceptMapAuthoring,
    DialogGuidanceAuthoringComponent,
    DiscussionAuthoring,
    DrawAuthoring,
    EditAiChatAdvancedComponent,
    EditAnimationAdvancedComponent,
    EditAudioOscillatorAdvancedComponent,
    EditCommonAdvancedComponent,
    EditComponentAddToNotebookButtonComponent,
    EditComponentAdvancedButtonComponent,
    EditComponentConstraintsComponent,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentMaxSubmitComponent,
    EditComponentPeerGroupingTagComponent,
    EditComponentPrompt,
    EditComponentRubricComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditComponentWidthComponent,
    EditConceptMapAdvancedComponent,
    EditConceptMapConnectedComponentsComponent,
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentsComponent,
    EditConnectedComponentsWithBackgroundComponent,
    EditConnectedComponentDeleteButtonComponent,
    EditConnectedComponentTypeSelectComponent,
    EditDialogGuidanceAdvancedComponent,
    EditDiscussionAdvancedComponent,
    EditDiscussionConnectedComponentsComponent,
    EditDrawAdvancedComponent,
    EditDrawConnectedComponentsComponent,
    EditEmbeddedAdvancedComponent,
    EditGraphAdvancedComponent,
    EditGraphConnectedComponentsComponent,
    EditLabelAdvancedComponent,
    EditLabelConnectedComponentsComponent,
    EditHTMLAdvancedComponent,
    EditMatchAdvancedComponent,
    EditMatchConnectedComponentsComponent,
    EditMultipleChoiceAdvancedComponent,
    EditMultipleChoiceConnectedComponentsComponent,
    EditOpenResponseAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EditPeerChatAdvancedComponentComponent,
    EditSummaryAdvancedComponent,
    EditTableAdvancedComponent,
    EditTableConnectedComponentsComponent,
    EmbeddedAuthoring,
    GraphAuthoring,
    HtmlAuthoring,
    LabelAuthoring,
    MatchAuthoring,
    MultipleChoiceAuthoring,
    OpenResponseAuthoring,
    OutsideUrlAuthoring,
    PeerChatAuthoringComponent,
    ShowGroupWorkAuthoringComponent,
    ShowMyWorkAuthoringComponent,
    SummaryAuthoring,
    TableAuthoring
  ]
})
export class ComponentAuthoringModule {}
