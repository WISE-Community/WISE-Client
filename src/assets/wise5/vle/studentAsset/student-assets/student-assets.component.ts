import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';

@Component({
  selector: 'student-assets',
  templateUrl: './student-assets.component.html',
  styleUrls: ['./student-assets.component.scss']
})
export class StudentAssetsComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  mode: string;
  studentAssets: any;
  componentsThatCanAcceptAssets: string[] = ['ConceptMap', 'Discussion', 'Draw', 'Label', 'Table'];

  constructor(
    private configService: ConfigService,
    private projectService: ProjectService,
    private studentAssetService: StudentAssetService
  ) {}

  ngOnInit(): void {
    this.mode = this.configService.getMode();
    this.studentAssets = this.studentAssetService.allAssets;
    if (!this.configService.isPreview()) {
      this.retrieveStudentAssets();
    }
  }

  retrieveStudentAssets(): void {
    this.studentAssetService.retrieveAssets().then((studentAssets) => {
      this.studentAssets = studentAssets;
    });
  }

  uploadStudentAssets(files: any[]): void {
    for (const file of files) {
      this.studentAssetService.uploadAsset(file).then((studentAsset) => {
        this.attachStudentAsset(studentAsset);
        this.studentAssets = this.studentAssetService.allAssets;
      });
    }
  }

  attachStudentAssetToComponent($event, studentAsset: any): void {
    // prevents parent student asset list item from getting the onclick event so this item won't be
    // re-selected.
    $event.stopPropagation();
    this.attachStudentAsset(studentAsset);
  }

  attachStudentAsset(studentAsset: any): void {
    const component = this.projectService.getComponent(this.nodeId, this.componentId);
    if (this.componentsThatCanAcceptAssets.includes(component.type)) {
      this.studentAssetService.broadcastAttachStudentAsset(
        this.nodeId,
        this.componentId,
        studentAsset
      );
    }
  }
}
