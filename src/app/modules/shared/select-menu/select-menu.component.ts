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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatSelectModule, ReactiveFormsModule],
  selector: 'app-select-menu',
  standalone: true,
  styleUrl: './select-menu.component.scss',
  templateUrl: './select-menu.component.html'
})
export class SelectMenuComponent implements OnInit {
  @Output('update') change: EventEmitter<string> = new EventEmitter<string>();
  @Input() disable: boolean;
  @Input() multiple: boolean;
  @Input() options: any[] = [];
  @Input() placeholderText: string = $localize`Select an option`;
  protected selectField = new FormControl('');
  @Input() value: any;
  @Input() valueProp: string = 'value';
  @Input() viewValueProp: string = 'viewValue';

  ngOnInit(): void {
    this.selectField = new FormControl({
      value: this.value,
      disabled: this.disable
    });
    this.selectField.valueChanges.subscribe((value) => {
      this.change.emit(this.selectField.value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.value = changes.value.currentValue;
      this.selectField.setValue(this.value);
    }
    if (changes.disable) {
      this.disable = changes.disable.currentValue;
      this.disable ? this.selectField.disable() : this.selectField.enable();
    }
  }
}
