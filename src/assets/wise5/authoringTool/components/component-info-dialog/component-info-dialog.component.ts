import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { Component as WISEComponent } from '../../../common/Component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ComponentTypeSelectorComponent } from '../component-type-selector/component-type-selector.component';
import { PreviewComponentComponent } from '../preview-component/preview-component.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [
    CommonModule,
    ComponentTypeSelectorComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    PreviewComponentComponent
  ],
  standalone: true,
  styleUrl: './component-info-dialog.component.scss',
  templateUrl: './component-info-dialog.component.html'
})
export class ComponentInfoDialogComponent {
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

  protected displayComponent(componentType: string): void {
    const componentInfo = this.componentInfoService.getInfo(componentType);
    this.description = componentInfo.getDescription();
    this.previewExamples = componentInfo.getPreviewExamples();
    this.previewComponents = this.previewExamples.map((example: any) => {
      return new ComponentFactory().getComponent(example.content, 'node1');
    });
  }
}
