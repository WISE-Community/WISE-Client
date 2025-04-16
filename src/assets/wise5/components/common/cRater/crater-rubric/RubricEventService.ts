import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RubricEventService {
  private writableIsRubricOpen = signal(false);
  readonly isRubricOpen = this.writableIsRubricOpen.asReadonly();

  emitRubricToggledEvent(): void {
    this.writableIsRubricOpen.update((isOpen) => !isOpen);
    console.log(this.isRubricOpen());
  }
}
