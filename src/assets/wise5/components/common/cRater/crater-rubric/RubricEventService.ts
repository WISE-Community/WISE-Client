import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RubricEventService {
  private isRubricOpen: boolean;

  getIsRubricOpen(): boolean {
    return this.isRubricOpen;
  }

  rubricToggled(): void {
    this.isRubricOpen = !this.isRubricOpen;
  }
}
