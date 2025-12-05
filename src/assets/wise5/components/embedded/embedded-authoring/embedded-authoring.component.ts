import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { AuthorUrlParametersComponent } from '../../../../../app/authoring-tool/author-url-parameters/author-url-parameters.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableTextareaComponent } from '../../../authoringTool/components/translatable-textarea/translatable-textarea.component';
import { EmbeddedService } from '../embeddedService';

@Component({
  selector: 'embedded-authoring',
  templateUrl: 'embedded-authoring.component.html',
  styleUrl: 'embedded-authoring.component.scss',
  imports: [
    TranslatableTextareaComponent,
    TranslatableAssetChooserComponent,
    AuthorUrlParametersComponent,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatCheckbox,
    MatIcon,
    MatTooltip
  ]
})
export class EmbeddedAuthoring extends AbstractComponentAuthoring {
  private embeddedService = inject(EmbeddedService);

  embeddedApplicationIFrameId: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.embeddedApplicationIFrameId = this.embeddedService.getEmbeddedApplicationIframeId(
      this.componentId
    );
  }

  updateUrl(url: string): void {
    this.componentContent.url = url;
    this.componentChanged();
  }
}
