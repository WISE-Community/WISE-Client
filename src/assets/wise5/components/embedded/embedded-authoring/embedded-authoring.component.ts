import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthorUrlParametersComponent } from '../../../../../app/authoring-tool/author-url-parameters/author-url-parameters.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableTextareaComponent } from '../../../authoringTool/components/translatable-textarea/translatable-textarea.component';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedService } from '../embeddedService';

@Component({
  selector: 'embedded-authoring',
  templateUrl: 'embedded-authoring.component.html',
  styleUrl: 'embedded-authoring.component.scss',
  imports: [
    FlexModule,
    TranslatableTextareaComponent,
    TranslatableAssetChooserComponent,
    AuthorUrlParametersComponent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatCheckbox,
    MatIcon,
    MatTooltip,
    MatButton
  ]
})
export class EmbeddedAuthoring extends AbstractComponentAuthoring {
  embeddedApplicationIFrameId: string;

  constructor(
    protected ConfigService: ConfigService,
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
