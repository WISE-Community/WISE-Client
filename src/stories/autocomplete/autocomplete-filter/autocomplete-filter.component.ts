import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  selector: 'autocomplete-filter',
  templateUrl: 'autocomplete-filter.component.html'
})
export class AutocompleteFilterComponent implements OnInit {
  colorControl = new FormControl('');
  options: string[] = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.colorControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value || ''))
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  protected clear(event: Event): void {
    this.colorControl.reset();
  }
}
