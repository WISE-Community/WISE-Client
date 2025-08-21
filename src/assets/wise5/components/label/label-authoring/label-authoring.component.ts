import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';

@Component({
  selector: 'label-authoring',
  templateUrl: 'label-authoring.component.html',
  styleUrl: 'label-authoring.component.scss',
  imports: [
    EditComponentPrompt,
    TranslatableInputComponent,
    TranslatableAssetChooserComponent,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatCheckbox,
    MatButton,
    MatTooltip,
    MatIcon
  ]
})
export class LabelAuthoring extends AbstractComponentAuthoring {
  numberInputChange: Subject<number> = new Subject<number>();
  textInputChange: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentContent.enableCircles == null) {
      // If this component was created before enableCircles was implemented, we will default it to
      // true in the authoring so that the "Enable Dots" checkbox is checked.
      this.componentContent.enableCircles = true;
    }
    this.subscriptions.add(
      this.numberInputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.textInputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  addLabel(): void {
    const newLabel = {
      text: $localize`Enter text here`,
      color: 'blue',
      pointX: 100,
      pointY: 100,
      textX: 200,
      textY: 200,
      canEdit: false,
      canDelete: false,
      isStarterLabel: true
    };
    this.componentContent.labels.push(newLabel);
    this.componentChanged();
  }

  deleteLabel(index: number, label: any): void {
    if (confirm($localize`Are you sure you want to delete this label?\n\n${label.text}`)) {
      this.componentContent.labels.splice(index, 1);
      this.componentChanged();
    }
  }

  saveStarterState(starterState: any): void {
    this.componentContent.labels = starterState;
    this.componentChanged();
  }

  compareTextAlphabetically(stringA: string, stringB: string) {
    if (stringA < stringB) {
      return -1;
    } else if (stringA > stringB) {
      return 1;
    } else {
      return 0;
    }
  }

  deleteStarterState(): void {
    this.componentContent.labels = [];
    this.componentChanged();
  }

  openColorViewer(): void {
    window.open('http://www.javascripter.net/faq/colornam.htm');
  }
}
