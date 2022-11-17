'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedService } from '../embeddedService';

@Component({
  selector: 'embedded-authoring',
  templateUrl: 'embedded-authoring.component.html',
  styleUrls: ['embedded-authoring.component.scss']
})
export class EmbeddedAuthoring extends ComponentAuthoring {
  embeddedApplicationIFrameId: string;

  constructor(
    protected ConfigService: ConfigService,
    private EmbeddedService: EmbeddedService,
    protected NodeService: NodeService,
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
}
