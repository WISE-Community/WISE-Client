import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

type SelectAllItemsStatus = 'none' | 'some' | 'all';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, MatTooltipModule],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }],
  selector: 'select-all-items-checkbox',
  styleUrl: './select-all-items-checkbox.component.scss',
  templateUrl: './select-all-items-checkbox.component.html'
})
export class SelectAllItemsCheckboxComponent {
  readonly allSelectedEvent = output<void>();
  readonly noneSelectedEvent = output<void>();
  readonly numAllItems = input<number>(0);
  readonly numSelectedItems = input<number>(0);
  readonly tooltip = input<string>();

  protected readonly status = computed<SelectAllItemsStatus>(() => {
    const numSelected = this.numSelectedItems();
    const numAll = this.numAllItems();
    if (numSelected === 0) {
      return 'none';
    } else if (numSelected < numAll) {
      return 'some';
    } else {
      return 'all';
    }
  });

  protected select(): void {
    if (this.status() === 'none') {
      this.allSelectedEvent.emit();
    } else {
      this.noneSelectedEvent.emit();
    }
  }
}

