import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'app-search-bar',
  standalone: true,
  styleUrl: './search-bar.component.scss',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent implements OnInit {
  @Output('update') change: EventEmitter<string> = new EventEmitter<string>();
  @Input() debounce: number = 250;
  @Input() disable: boolean;
  @Input() placeholderText: string = $localize`Search`;
  protected searchField = new FormControl('');
  @Input() value: string = '';

  ngOnInit(): void {
    this.searchField = new FormControl({
      value: this.value,
      disabled: this.disable
    });
    this.searchField.valueChanges
      .pipe(debounceTime(this.debounce))
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.change.emit(this.searchField.value);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.value = changes.value.currentValue;
      this.searchField.setValue(this.value);
    }
    if (changes.disable) {
      this.disable = changes.disable.currentValue;
      this.disable ? this.searchField.disable() : this.searchField.enable();
    }
  }

  protected clear(): void {
    this.searchField.setValue('');
  }
}
