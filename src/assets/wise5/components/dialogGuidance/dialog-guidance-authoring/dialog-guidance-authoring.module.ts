import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditFeedbackRulesComponent } from '../../common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { DialogGuidanceService } from '../dialogGuidanceService';
import { FeedbackRuleHelpComponent } from '../../common/feedbackRule/feedback-rule-help/feedback-rule-help.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';

@NgModule({
  declarations: [
    DialogGuidanceAuthoringComponent,
    EditComponentPrompt,
    EditComponentMaxSubmitComponent,
    EditFeedbackRulesComponent,
    FeedbackRuleHelpComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatableInputComponent
  ],
  providers: [
    AnnotationService,
    ComputerAvatarService,
    ConfigService,
    DialogGuidanceService,
    NodeService,
    ProjectAssetService,
    ProjectService,
    SessionService,
    StudentDataService,
    TagService,
    TeacherProjectService
  ],
  exports: [
    DialogGuidanceAuthoringComponent,
    EditComponentPrompt,
    EditComponentMaxSubmitComponent,
    EditFeedbackRulesComponent
  ]
})
export class DialogGuidanceAuthoringModule {}
