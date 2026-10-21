import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { StandardType } from '../../library/standard';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  selector: 'standards-select-menu',
  templateUrl: './standards-select-menu.component.html'
})
export class StandardsSelectMenuComponent extends SelectMenuComponent {
  readonly possibleLabels = input<StandardType[]>([]);

  protected readonly groupedStandards = computed(() => {
    const options = this.options();
    const possible = this.possibleLabels();
    const standardOptions: Record<string, any[]> = {};
    const uniqueLabels = new Set<StandardType>();

    options.forEach((option) => {
      uniqueLabels.add(option.type);
      if (!standardOptions[option.type]) {
        standardOptions[option.type] = [];
      }
      standardOptions[option.type].push(option);
    });

    const labels = possible.filter((label) => uniqueLabels.has(label));
    return { labels, standardOptions };
  });

  protected get labels(): StandardType[] {
    return this.groupedStandards().labels;
  }

  protected get standardOptions(): Record<string, any[]> {
    return this.groupedStandards().standardOptions;
  }
}
