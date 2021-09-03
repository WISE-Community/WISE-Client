import { NgModule } from '@angular/core';
import { AnimationAuthoring } from '../../assets/wise5/components/animation/animation-authoring/animation-authoring.component';
import { AudioOscillatorAuthoring } from '../../assets/wise5/components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from '../../assets/wise5/components/conceptMap/concept-map-authoring/concept-map-authoring.component';
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
import { WiseAuthoringTinymceEditorComponent } from '../../assets/wise5/directives/wise-tinymce-editor/wise-authoring-tinymce-editor.component';
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
import { EditConnectedComponentComponentSelectComponent } from '../authoring-tool/edit-connected-component-component-select/edit-connected-component-component-select.component';
import { EditConnectedComponentDeleteButtonComponent } from '../authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentNodeSelectComponent } from '../authoring-tool/edit-connected-component-node-select/edit-connected-component-node-select.component';
import { EditConnectedComponentTypeSelectComponent } from '../authoring-tool/edit-connected-component-type-select/edit-connected-component-type-select.component';
import { EditConnectedComponentsComponent } from '../authoring-tool/edit-connected-components/edit-connected-components.component';
import { AngularJSModule } from '../common-hybrid-angular.module';
import { EditConceptMapConnectedComponentsComponent } from '../../assets/wise5/components/conceptMap/edit-concept-map-connected-components/edit-concept-map-connected-components.component';
import { EditDrawConnectedComponentsComponent } from '../../assets/wise5/components/draw/edit-draw-connected-components/edit-draw-connected-components.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';
import { EditGraphConnectedComponentsComponent } from '../../assets/wise5/components/graph/edit-graph-connected-components/edit-graph-connected-components.component';
import { EditLabelConnectedComponentsComponent } from '../../assets/wise5/components/label/edit-label-connected-components/edit-label-connected-components.component';
import { EditTableConnectedComponentsComponent } from '../../assets/wise5/components/table/edit-table-connected-components/edit-table-connected-components.component';

@NgModule({
  declarations: [
    AnimationAuthoring,
    AudioOscillatorAuthoring,
    ConceptMapAuthoring,
    DrawAuthoring,
    DiscussionAuthoring,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentPrompt,
    EditComponentRubricComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditComponentWidthComponent,
    EditConceptMapConnectedComponentsComponent,
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentsComponent,
    EditConnectedComponentsWithBackgroundComponent,
    EditConnectedComponentComponentSelectComponent,
    EditConnectedComponentDeleteButtonComponent,
    EditConnectedComponentNodeSelectComponent,
    EditConnectedComponentTypeSelectComponent,
    EditDrawConnectedComponentsComponent,
    EditGraphConnectedComponentsComponent,
    EditLabelConnectedComponentsComponent,
    EditHTMLAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EditTableConnectedComponentsComponent,
    EmbeddedAuthoring,
    GraphAuthoring,
    HtmlAuthoring,
    LabelAuthoring,
    MatchAuthoring,
    MultipleChoiceAuthoring,
    OpenResponseAuthoring,
    OutsideUrlAuthoring,
    SummaryAuthoring,
    TableAuthoring,
    WiseAuthoringTinymceEditorComponent
  ],
  imports: [AngularJSModule],
  exports: [
    AnimationAuthoring,
    AudioOscillatorAuthoring,
    ConceptMapAuthoring,
    DrawAuthoring,
    DiscussionAuthoring,
    EditComponentDefaultFeedback,
    EditComponentExcludeFromTotalScoreComponent,
    EditComponentJsonComponent,
    EditComponentMaxScoreComponent,
    EditComponentPrompt,
    EditComponentRubricComponent,
    EditComponentSaveButtonComponent,
    EditComponentSubmitButtonComponent,
    EditComponentTagsComponent,
    EditComponentWidthComponent,
    EditConceptMapConnectedComponentsComponent,
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentsComponent,
    EditConnectedComponentsWithBackgroundComponent,
    EditConnectedComponentComponentSelectComponent,
    EditConnectedComponentDeleteButtonComponent,
    EditConnectedComponentNodeSelectComponent,
    EditConnectedComponentTypeSelectComponent,
    EditDrawConnectedComponentsComponent,
    EditGraphConnectedComponentsComponent,
    EditLabelConnectedComponentsComponent,
    EditHTMLAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EditTableConnectedComponentsComponent,
    EmbeddedAuthoring,
    GraphAuthoring,
    HtmlAuthoring,
    LabelAuthoring,
    MatchAuthoring,
    MultipleChoiceAuthoring,
    OpenResponseAuthoring,
    OutsideUrlAuthoring,
    SummaryAuthoring,
    TableAuthoring,
    WiseAuthoringTinymceEditorComponent
  ]
})
export class ComponentAuthoringModule {}
