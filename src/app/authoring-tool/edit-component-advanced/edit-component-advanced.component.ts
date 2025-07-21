import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { Component as WiseComponent } from '../../../assets/wise5/common/Component';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { EditAiChatAdvancedComponent } from '../../../assets/wise5/components/aiChat/edit-ai-chat-advanced/edit-ai-chat-advanced.component';
import { EditAnimationAdvancedComponent } from '../../../assets/wise5/components/animation/edit-animation-advanced/edit-animation-advanced.component';
import { EditAudioOscillatorAdvancedComponent } from '../../../assets/wise5/components/audioOscillator/edit-audio-oscillator-advanced/edit-audio-oscillator-advanced.component';
import { EditConceptMapAdvancedComponent } from '../../../assets/wise5/components/conceptMap/edit-concept-map-advanced/edit-concept-map-advanced.component';
import { EditDiscussionAdvancedComponent } from '../../../assets/wise5/components/discussion/edit-discussion-advanced/edit-discussion-advanced.component';
import { EditDrawAdvancedComponent } from '../../../assets/wise5/components/draw/edit-draw-advanced/edit-draw-advanced.component';
import { EditEmbeddedAdvancedComponent } from '../../../assets/wise5/components/embedded/edit-embedded-advanced/edit-embedded-advanced.component';
import { EditGraphAdvancedComponent } from '../../../assets/wise5/components/graph/edit-graph-advanced/edit-graph-advanced.component';
import { EditDialogGuidanceAdvancedComponent } from '../../../assets/wise5/components/dialogGuidance/edit-dialog-guidance-advanced/edit-dialog-guidance-advanced.component';
import { EditHTMLAdvancedComponent } from '../../../assets/wise5/components/html/edit-html-advanced/edit-html-advanced.component';
import { EditLabelAdvancedComponent } from '../../../assets/wise5/components/label/edit-label-advanced/edit-label-advanced.component';
import { EditMatchAdvancedComponent } from '../../../assets/wise5/components/match/edit-match-advanced/edit-match-advanced.component';
import { EditMultipleChoiceAdvancedComponent } from '../../../assets/wise5/components/multipleChoice/edit-multiple-choice-advanced/edit-multiple-choice-advanced.component';
import { EditOpenResponseAdvancedComponent } from '../../../assets/wise5/components/openResponse/edit-open-response-advanced/edit-open-response-advanced.component';
import { EditOutsideUrlAdvancedComponent } from '../../../assets/wise5/components/outsideURL/edit-outside-url-advanced/edit-outside-url-advanced.component';
import { EditPeerChatAdvancedComponentComponent } from '../../../assets/wise5/components/peerChat/edit-peer-chat-advanced-component/edit-peer-chat-advanced-component.component';
import { EditComponentConstraintsComponent } from '../edit-component-constraints/edit-component-constraints.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';
import { EditSummaryAdvancedComponent } from '../../../assets/wise5/components/summary/edit-summary-advanced/edit-summary-advanced.component';
import { EditTableAdvancedComponent } from '../../../assets/wise5/components/table/edit-table-advanced/edit-table-advanced.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'edit-component-advanced',
  templateUrl: './edit-component-advanced.component.html',
  styles: [
    '.mat-divider { margin: 0 -16px; } .mat-mdc-dialog-content { padding-top: 10px !important; padding-bottom: 10px !important; }'
  ],
  imports: [
    MatDialogTitle,
    MatDivider,
    CdkScrollable,
    MatDialogContent,
    NgSwitch,
    NgSwitchCase,
    EditAiChatAdvancedComponent,
    EditAnimationAdvancedComponent,
    EditAudioOscillatorAdvancedComponent,
    EditConceptMapAdvancedComponent,
    EditDiscussionAdvancedComponent,
    EditDrawAdvancedComponent,
    EditEmbeddedAdvancedComponent,
    EditGraphAdvancedComponent,
    EditDialogGuidanceAdvancedComponent,
    EditHTMLAdvancedComponent,
    EditLabelAdvancedComponent,
    EditMatchAdvancedComponent,
    EditMultipleChoiceAdvancedComponent,
    EditOpenResponseAdvancedComponent,
    EditOutsideUrlAdvancedComponent,
    EditPeerChatAdvancedComponentComponent,
    EditComponentConstraintsComponent,
    EditComponentJsonComponent,
    EditSummaryAdvancedComponent,
    EditTableAdvancedComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ]
})
export class EditComponentAdvancedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected component: WiseComponent) {}
}
