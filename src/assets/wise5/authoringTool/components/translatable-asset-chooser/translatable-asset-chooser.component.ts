import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetChooser } from '../../project-asset-authoring/asset-chooser';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { AbstractTranslatableFieldComponent } from '../abstract-translatable-field/abstract-translatable-field.component';

@Component({
  selector: 'translatable-asset-chooser',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './translatable-asset-chooser.component.html',
  styleUrl: './translatable-asset-chooser.component.scss'
})
export class TranslatableAssetChooserComponent extends AbstractTranslatableFieldComponent {
  @Input() tooltip: String = $localize`Choose image`;
  @Input() processAsset: (value: string) => string = (value) => {
    return value;
  };

  private dialog = inject(MatDialog);

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
