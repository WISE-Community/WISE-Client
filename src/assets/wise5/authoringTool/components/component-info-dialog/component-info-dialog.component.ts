import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfo } from '../../../components/ComponentInfo';
import { ComponentFactory } from '../../../common/ComponentFactory';

@Component({
  selector: 'component-info-dialog',
  templateUrl: './component-info-dialog.component.html',
  styleUrls: ['./component-info-dialog.component.scss']
})
export class ComponentInfoDialogComponent {
  protected component: any;
  private componentInfo: ComponentInfo;
  protected description: string;
  protected label: string;

  constructor(
    private componentInfoService: ComponentInfoService,
    @Inject(MAT_DIALOG_DATA) private componentType: string
  ) {}

  ngOnInit(): void {
    this.componentInfo = this.componentInfoService.getInfo(this.componentType);
    this.label = this.componentInfo.getLabel();
    this.description = this.componentInfo.getDescription();
    this.component = new ComponentFactory().getComponent(
      this.componentInfo.getPreviewContent(),
      'node1'
    );
  }
}
