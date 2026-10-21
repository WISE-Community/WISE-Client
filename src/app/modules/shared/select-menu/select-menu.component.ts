import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  selector: 'app-select-menu',
  styleUrl: './select-menu.component.scss',
  templateUrl: './select-menu.component.html'
})
export class SelectMenuComponent {
  protected cdr = inject(ChangeDetectorRef);

  readonly change = output<any>({ alias: 'update' });
  readonly disable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly multiple = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly options = input<any[]>([]);
  readonly placeholderText = input<string>($localize`Select an option`);
  readonly value = input<any>();
  readonly valueProp = input<string>('value');
  readonly viewValueProp = input<string>('viewValue');

  protected readonly selectField = new FormControl<any>('');

  constructor() {
    this.selectField.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.change.emit(value);
    });

    effect(() => {
      const val = this.value();
      if (this.selectField.value !== val) {
        this.selectField.setValue(val, { emitEvent: false });
        this.cdr.markForCheck();
      }
    });

    effect(() => {
      if (this.disable()) {
        this.selectField.disable({ emitEvent: false });
      } else {
        this.selectField.enable({ emitEvent: false });
      }
      this.cdr.markForCheck();
    });
  }
}
