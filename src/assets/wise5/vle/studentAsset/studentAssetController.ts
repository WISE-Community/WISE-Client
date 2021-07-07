'use strict';

import { ConfigService } from '../../services/configService';
import { StudentAssetService } from '../../services/studentAssetService';
import { SessionService } from '../../services/sessionService';
import { ProjectService } from '../../services/projectService';

class StudentAssetController {
  $translate: any;
  componentController: any;
  item: any;
  itemId: string;
  logOutListener: any;
  mode: string;
  studentAssets: any;
  templateUrl: string;
  nodeId: string;
  componentId: string;
  convertedComponents: string[] = ['ConceptMap', 'Discussion', 'Draw', 'Label', 'Table'];

  static $inject = [
    '$filter',
    '$rootScope',
    '$scope',
    'ConfigService',
    'ProjectService',
    'SessionService',
    'StudentAssetService'
  ];

  constructor(
    $filter: any,
    private $rootScope: any,
    $scope: any,
    private ConfigService: ConfigService,
    private ProjectService: ProjectService,
    private SessionService: SessionService,
    private StudentAssetService: StudentAssetService
  ) {
    this.$rootScope = $rootScope;
    this.mode = this.ConfigService.getMode();
    this.SessionService = SessionService;
    this.StudentAssetService = StudentAssetService;
    this.$translate = $filter('translate');
    this.studentAssets = this.StudentAssetService.allAssets;
    this.itemId = null;
    this.item = null;

    this.SessionService.logOut$.subscribe(() => {
      this.logOutListener();
    });

    if (!this.ConfigService.isPreview()) {
      this.retrieveStudentAssets();
    }
  }

  getTemplateUrl() {
    return this.templateUrl;
  }

  retrieveStudentAssets() {
    this.StudentAssetService.retrieveAssets().then((studentAssets) => {
      this.studentAssets = studentAssets;
    });
  }

  // TODO can we ensure files is not null?
  uploadStudentAssets(files) {
    if (files != null) {
      for (const file of files) {
        this.StudentAssetService.uploadAsset(file).then((studentAsset) => {
          this.attachStudentAsset(studentAsset);
          this.studentAssets = this.StudentAssetService.allAssets;
        });
      }
    }
  }

  deleteStudentAsset(studentAsset) {
    alert(this.$translate('deleteStudentAssetNotImplementedYet'));
  }

  attachStudentAssetToComponent($event, studentAsset) {
    this.attachStudentAsset(studentAsset);
    $event.stopPropagation(); // prevents parent student asset list item from getting the onclick event so this item won't be re-selected.
  }

  attachStudentAsset(studentAsset: any): void {
    const component = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    if (this.convertedComponents.includes(component.type)) {
      this.StudentAssetService.broadcastAttachStudentAsset(
        this.nodeId,
        this.componentId,
        studentAsset
      );
    } else if (this.componentController != null) {
      // If the student asset dialog is a part of a component (e.g. attaching image to OR or Discussion)
      // Also attach the file(s) to the componentstate's attachments
      this.componentController.attachStudentAsset(studentAsset);
    }
  }
}

export default StudentAssetController;
