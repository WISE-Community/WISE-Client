import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ShowMyWorkAuthoringComponent } from '../../showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'show-group-work-authoring',
  templateUrl: './show-group-work-authoring.component.html',
  styleUrls: ['./show-group-work-authoring.component.scss']
})
export class ShowGroupWorkAuthoringComponent extends ShowMyWorkAuthoringComponent {
  constructor(
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }
}
