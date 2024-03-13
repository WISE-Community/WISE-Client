import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetChooser } from '../../project-asset-authoring/asset-chooser';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';
import { EditProjectTranslationService } from '../../../services/editProjectTranslationService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslateProjectService } from '../../../services/translateProjectService';

@Component({
  standalone: true,
  selector: 'translatable-asset-chooser',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './translatable-asset-chooser.component.html'
})
export class TranslatableAssetChooserComponent extends AbstractTranslatableFieldComponent {
  constructor(
    private dialog: MatDialog,
    protected editProjectTranslationService: EditProjectTranslationService,
    protected projectService: TeacherProjectService,
    protected translateProjectService: TranslateProjectService
  ) {
    super(editProjectTranslationService, projectService, translateProjectService);
  }

  protected chooseAsset(): void {
    new AssetChooser(this.dialog)
      .open(this.key, this.content)
      .afterClosed()
      .pipe(filter((data) => data != null))
      .subscribe(({ assetItem }) => {
        if (this.showTranslationInput) {
          this.translationTextChanged.next(assetItem.fileName);
        } else {
          this.defaultLanguageTextChanged.next(assetItem.fileName);
        }
      });
  }
}
