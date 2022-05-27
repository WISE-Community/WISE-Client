import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpgradeModule } from '@angular/upgrade/static';
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
import { UtilService } from '../../../services/utilService';
import { EditDialogGuidanceFeedbackRulesComponent } from '../edit-dialog-guidance-feedback-rules/edit-dialog-guidance-feedback-rules.component';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { DialogGuidanceService } from '../dialogGuidanceService';
import { NodeInfoService } from '../../../services/nodeInfoService';

@NgModule({
  declarations: [
    DialogGuidanceAuthoringComponent,
    EditComponentPrompt,
    EditComponentMaxSubmitComponent,
    EditDialogGuidanceFeedbackRulesComponent
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
    UpgradeModule
  ],
  providers: [
    AnnotationService,
    ComputerAvatarService,
    ConfigService,
    DialogGuidanceService,
    NodeService,
    NodeInfoService,
    ProjectAssetService,
    ProjectService,
    SessionService,
    StudentDataService,
    TagService,
    TeacherProjectService,
    UtilService
  ],
  exports: [
    DialogGuidanceAuthoringComponent,
    EditComponentPrompt,
    EditComponentMaxSubmitComponent,
    EditDialogGuidanceFeedbackRulesComponent
  ]
})
export class DialogGuidanceAuthoringModule {}
