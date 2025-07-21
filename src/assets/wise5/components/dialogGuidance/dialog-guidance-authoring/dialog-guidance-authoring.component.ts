import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { FlexModule } from '@angular/flex-layout/flex';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { EditDialogGuidanceComputerAvatarComponent } from '../edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { EditFeedbackRulesComponent } from '../../common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';

@Component({
  selector: 'dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html',
  styles: ['edit-feedback-rules { margin-bottom: 16px; } '],
  imports: [
    FlexModule,
    EditComponentPrompt,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    EditComponentMaxSubmitComponent,
    MatCheckbox,
    NgIf,
    EditDialogGuidanceComputerAvatarComponent,
    EditFeedbackRulesComponent
  ]
})
export class DialogGuidanceAuthoringComponent extends AbstractComponentAuthoring {
  constructor(
    private computerAvatarService: ComputerAvatarService,
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.componentContent.computerAvatarSettings == null) {
      this.componentContent.computerAvatarSettings =
        this.computerAvatarService.getDefaultComputerAvatarSettings();
    }
    this.componentContent.cRaterRubric = this.componentContent.cRaterRubric || new CRaterRubric();
  }
}
