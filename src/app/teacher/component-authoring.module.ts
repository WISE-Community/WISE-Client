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
import { AngularJSModule } from '../common-hybrid-angular.module';

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
    EditHTMLAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
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
    EditHTMLAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
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
