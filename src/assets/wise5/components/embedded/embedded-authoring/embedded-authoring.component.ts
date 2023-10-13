'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedService } from '../embeddedService';
import { MatDialog } from '@angular/material/dialog';
import { AssetChooser } from '../../../authoringTool/project-asset-authoring/asset-chooser';
import { filter } from 'rxjs/operators';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'embedded-authoring',
  templateUrl: 'embedded-authoring.component.html',
  styleUrls: ['embedded-authoring.component.scss']
})
export class EmbeddedAuthoring extends AbstractComponentAuthoring {
  embeddedApplicationIFrameId: string;

  constructor(
    protected ConfigService: ConfigService,
    private dialog: MatDialog,
    private EmbeddedService: EmbeddedService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.embeddedApplicationIFrameId = this.EmbeddedService.getEmbeddedApplicationIframeId(
      this.componentId
    );
  }

  assetSelected({ nodeId, componentId, assetItem, target }): void {
    super.assetSelected({ nodeId, componentId, assetItem, target });
    if (target === 'modelFile') {
      this.componentContent.url = assetItem.fileName;
      this.componentChanged();
    }
  }

  reloadModel(): void {
    const iframe: any = document.getElementById(this.embeddedApplicationIFrameId);
    const src = iframe.src;
    iframe.src = '';
    iframe.src = src;
  }

  updateUrl(url: string): void {
    this.componentContent.url = url;
    this.componentChanged();
  }

  chooseModelFile(): void {
    new AssetChooser(this.dialog, this.nodeId, this.componentId)
      .open('modelFile')
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe((data: any) => {
        return this.assetSelected(data);
      });
  }
}
