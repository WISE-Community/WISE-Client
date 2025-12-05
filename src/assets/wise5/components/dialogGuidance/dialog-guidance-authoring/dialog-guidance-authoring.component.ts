import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { EditFeedbackRulesComponent } from '../../common/feedbackRule/edit-feedback-rules/edit-feedback-rules.component';
import { EditDialogGuidanceComputerAvatarComponent } from '../edit-dialog-guidance-computer-avatar/edit-dialog-guidance-computer-avatar.component';
import { CRaterItemSelectComponent } from '../../common/cRater/crater-item-select/crater-item-select.component';
import { EditCRaterInfoComponent } from '../../common/cRater/edit-crater-info/edit-crater-info.component';

@Component({
  imports: [
    CRaterItemSelectComponent,
    EditComponentMaxSubmitComponent,
    EditComponentPrompt,
    EditCRaterInfoComponent,
    EditDialogGuidanceComputerAvatarComponent,
    EditFeedbackRulesComponent,
    FormsModule,
    MatCheckbox,
    MatFormFieldModule
  ],
  selector: 'dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html'
})
export class DialogGuidanceAuthoringComponent extends AbstractComponentAuthoring {
  private computerAvatarService = inject(ComputerAvatarService);


  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentContent.computerAvatarSettings == null) {
      this.componentContent.computerAvatarSettings =
        this.computerAvatarService.getDefaultComputerAvatarSettings();
    }
    this.componentContent.cRaterRubric = this.componentContent.cRaterRubric || new CRaterRubric();
  }
}
