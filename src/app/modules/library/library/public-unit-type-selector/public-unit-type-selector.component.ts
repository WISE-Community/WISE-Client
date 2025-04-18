import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectFilterValues } from '../../../../domain/projectFilterValues';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  selector: 'public-unit-type-selector',
  templateUrl: './public-unit-type-selector.component.html'
})
export class PublicUnitTypeSelectorComponent {
  protected communityBuilt: boolean = false;
  @Input() filterValues: ProjectFilterValues;
  @Output() publicUnitTypeUpdatedEvent: EventEmitter<void> = new EventEmitter<void>();
  protected wiseTested: boolean = false;

  protected updatePublicUnitType(): void {
    this.filterValues.publicUnitTypeValue = [];
    if (this.wiseTested) {
      this.filterValues.publicUnitTypeValue.push('wiseTested');
    }
    if (this.communityBuilt) {
      this.filterValues.publicUnitTypeValue.push('communityBuilt');
    }
    this.publicUnitTypeUpdatedEvent.emit();
  }
}
