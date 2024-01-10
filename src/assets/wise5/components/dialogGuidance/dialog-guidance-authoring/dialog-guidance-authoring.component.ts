import { Component } from '@angular/core';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { DialogGuidanceService } from '../dialogGuidanceService';

@Component({
  selector: 'dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html',
  styleUrls: ['./dialog-guidance-authoring.component.scss']
})
export class DialogGuidanceAuthoringComponent extends ComponentAuthoring {
  constructor(
    protected configService: ConfigService,
    private dialogGuidanceService: DialogGuidanceService,
    protected nodeService: NodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.componentContent.computerAvatarSettings == null) {
      this.componentContent.computerAvatarSettings = this.dialogGuidanceService.getDefaultComputerAvatarSettings();
    }
  }
}
