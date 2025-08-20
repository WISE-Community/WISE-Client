import { Component, Input } from '@angular/core';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { StandardType } from '../../library/standard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [FormsModule, MatSelectModule, ReactiveFormsModule],
  selector: 'standards-select-menu',
  templateUrl: './standards-select-menu.component.html'
})
export class StandardsSelectMenuComponent extends SelectMenuComponent {
  @Input() possibleLabels: StandardType[];
  protected labels: StandardType[] = [];
  protected standardOptions = {};

  ngOnInit(): void {
    super.ngOnInit();
    const uniqueLabels = new Set<StandardType>();
    this.options.forEach((option) => {
      uniqueLabels.add(option.type);
      if (!this.standardOptions[option.type]) {
        this.standardOptions[option.type] = [];
      }
      this.standardOptions[option.type].push(option);
    });
    this.labels = this.possibleLabels.filter((label) => uniqueLabels.has(label));
  }
}
