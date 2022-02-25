import { Component } from '@angular/core';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DialogGuidanceService } from '../dialogGuidanceService';

@Component({
  selector: 'dialog-guidance-authoring',
  templateUrl: './dialog-guidance-authoring.component.html',
  styleUrls: ['./dialog-guidance-authoring.component.scss']
})
export class DialogGuidanceAuthoringComponent extends ComponentAuthoring {
  inputChange: Subject<string> = new Subject<string>();

  constructor(
    protected configService: ConfigService,
    private dialogGuidanceService: DialogGuidanceService,
    protected nodeService: NodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
    this.subscriptions.add(
      this.inputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.authoringComponentContent.computerAvatarSettings == null) {
      this.authoringComponentContent.computerAvatarSettings = this.dialogGuidanceService.getDefaultComputerAvatarSettings();
    }
  }
}
