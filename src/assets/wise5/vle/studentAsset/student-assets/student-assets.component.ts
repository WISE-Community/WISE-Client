import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { Component as WISEComponent } from '../../../common/Component';
import { CommonModule } from '@angular/common';
import { DragAndDropDirective } from '../../../common/drag-and-drop/drag-and-drop.directive';

@Component({
  imports: [CommonModule, DragAndDropDirective],
  selector: 'student-assets',
  styleUrl: './student-assets.component.scss',
  templateUrl: './student-assets.component.html'
})
export class StudentAssetsComponent implements OnInit {
  @Input() component: WISEComponent;
  protected mode: string;
  protected studentAssets: any = [];

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
    this.studentAssetService
      .retrieveAssets()
      .then((studentAssets) => (this.studentAssets = studentAssets));
  }

  protected uploadStudentAssets(files: any[]): void {
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

  private attachStudentAsset(studentAsset: any): void {
    if (this.component.isAcceptsAssets()) {
      this.studentAssetService.broadcastAttachStudentAsset(this.component, studentAsset);
    }
  }
}
