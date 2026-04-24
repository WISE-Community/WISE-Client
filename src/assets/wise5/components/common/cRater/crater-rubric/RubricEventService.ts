import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RubricEventService {
  private rubricDisplayed: boolean;

  isRubricDisplayed(): boolean {
    return this.rubricDisplayed;
  }

  toggleRubricDisplayed(): void {
    this.rubricDisplayed = !this.rubricDisplayed;
  }
}
