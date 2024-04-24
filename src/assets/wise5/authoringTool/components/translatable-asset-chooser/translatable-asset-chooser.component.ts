import { Component, Input } from '@angular/core';
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
  @Input() tooltip: String = $localize`Choose image`;
  @Input() processAsset: (value: string) => string = (value) => {
    return value;
  };

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
        const value = this.processAsset(assetItem.fileName);
        if (this.showTranslationInput()) {
          this.translationTextChanged.next(value);
        } else {
          this.content[this.key] = value;
          this.defaultLanguageTextChanged.next(value);
        }
      });
  }
}
