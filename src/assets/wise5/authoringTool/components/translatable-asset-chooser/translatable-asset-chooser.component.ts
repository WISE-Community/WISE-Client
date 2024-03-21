import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetChooser } from '../../project-asset-authoring/asset-chooser';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';

@Component({
  standalone: true,
  selector: 'translatable-asset-chooser',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './translatable-asset-chooser.component.html',
  styleUrls: ['./translatable-asset-chooser.component.scss']
})
export class TranslatableAssetChooserComponent extends AbstractTranslatableFieldComponent {
  constructor(
    private dialog: MatDialog,
    protected projectService: TeacherProjectService,
    protected projectTranslationService: TeacherProjectTranslationService
  ) {
    super(projectService, projectTranslationService);
  }

  protected chooseAsset(): void {
    new AssetChooser(this.dialog)
      .open(this.key, this.content)
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe(({ assetItem }) => {
        if (this.showTranslationInput()) {
          this.translationTextChanged.next(assetItem.fileName);
        } else {
          this.content[this.key] = assetItem.fileName;
          this.defaultLanguageTextChanged.next(assetItem.fileName);
        }
      });
  }
}
