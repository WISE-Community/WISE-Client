import { insertWiseLinks, replaceWiseLinks } from '../../../common/wise-link/wise-link';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

class EditRubricComponentController {
  node: any;
  nodeId: string;
  rubric: string;

  static $inject = [
    '$state',
    'ConfigService',
    'ProjectService',
    'TeacherDataService',
    'UtilService'
  ];

  constructor(
    private $state: any,
    private ConfigService: ConfigService,
    private TeacherProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  $onInit(): void {
    this.nodeId = this.TeacherDataService.getCurrentNodeId();
    this.node = this.TeacherProjectService.getNodeById(this.nodeId);
    this.rubric = this.TeacherProjectService.replaceAssetPaths(replaceWiseLinks(this.node.rubric));
  }

  rubricChanged(): void {
    let html = this.ConfigService.removeAbsoluteAssetPaths(this.rubric);
    html = insertWiseLinks(html);
    this.node.rubric = html;
    this.TeacherProjectService.saveProject();
  }

  goBack(): void {
    this.$state.go('root.at.project.node', {
      projectId: this.ConfigService.getProjectId(),
      nodeId: this.nodeId
    });
  }
}

export const EditRubricComponent = {
  templateUrl: `/assets/wise5/authoringTool/node/editRubric/edit-rubric.component.html`,
  controller: EditRubricComponentController
};
