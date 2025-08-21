import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { EditFeedbackRulesComponent } from '../../common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { EditDialogGuidanceComputerAvatarComponent } from '../edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';

@Component({
  selector: 'dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html',
  styles: ['edit-feedback-rules { margin-bottom: 16px; } '],
  imports: [
    EditComponentPrompt,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    EditComponentMaxSubmitComponent,
    MatCheckbox,
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
