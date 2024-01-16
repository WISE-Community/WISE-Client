import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfo } from '../../../components/ComponentInfo';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  selector: 'component-info-dialog',
  templateUrl: './component-info-dialog.component.html',
  styleUrls: ['./component-info-dialog.component.scss']
})
export class ComponentInfoDialogComponent {
  private componentInfo: ComponentInfo;
  protected description: string;
  protected previewComponents: WISEComponent[] = [];
  protected previewExamples: any[] = [];

  constructor(
    private componentInfoService: ComponentInfoService,
    @Inject(MAT_DIALOG_DATA) protected componentType: string
  ) {}

  ngOnInit(): void {
    this.displayComponent(this.componentType);
  }

  protected displayComponent(componentType: any): void {
    this.componentInfo = this.componentInfoService.getInfo(componentType);
    this.description = this.componentInfo.getDescription();
    this.previewExamples = this.componentInfo.getPreviewExamples();
    this.previewComponents = this.previewExamples.map((example: any) => {
      return new ComponentFactory().getComponent(example.content, 'node1');
    });
  }
}
