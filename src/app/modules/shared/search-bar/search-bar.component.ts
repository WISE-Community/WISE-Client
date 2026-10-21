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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'app-search-bar',
  styleUrl: './search-bar.component.scss',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  private cdr = inject(ChangeDetectorRef);

  readonly change = output<string>({ alias: 'update' });
  readonly debounce = input<number>(250);
  readonly disable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly placeholderText = input<string>($localize`Search`);
  readonly value = input<string>('');

  protected readonly searchField = new FormControl<string>('', { nonNullable: true });

  constructor() {
    this.searchField.valueChanges
      .pipe(
        debounce(() => timer(this.debounce())),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => {
        this.change.emit(value);
      });

    effect(() => {
      const val = this.value();
      if (this.searchField.value !== val) {
        this.searchField.setValue(val, { emitEvent: false });
        this.cdr.markForCheck();
      }
    });

    effect(() => {
      if (this.disable()) {
        this.searchField.disable({ emitEvent: false });
      } else {
        this.searchField.enable({ emitEvent: false });
      }
      this.cdr.markForCheck();
    });
  }

  protected clear(): void {
    this.searchField.setValue('');
  }
}
