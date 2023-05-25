import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  selector: 'student-assets',
  templateUrl: './student-assets.component.html',
  styleUrls: ['./student-assets.component.scss']
})
export class StudentAssetsComponent implements OnInit {
  @Input() component: WISEComponent;
  protected mode: string;
  studentAssets: any;

  constructor(
    private configService: ConfigService,
    private studentAssetService: StudentAssetService
  ) {}

  ngOnInit(): void {
    this.mode = this.configService.getMode();
    this.studentAssets = this.studentAssetService.allAssets;
    if (!this.configService.isPreview()) {
      this.retrieveStudentAssets();
    }
  }

  private retrieveStudentAssets(): void {
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

  protected attachStudentAssetToComponent($event, studentAsset: any): void {
    // prevents parent student asset list item from getting the onclick event so this item won't be
    // re-selected.
    $event.stopPropagation();
    this.attachStudentAsset(studentAsset);
  }

  attachStudentAsset(studentAsset: any): void {
    if (this.component.isAcceptsAssets()) {
      this.studentAssetService.broadcastAttachStudentAsset(this.component, studentAsset);
    }
  }
}
