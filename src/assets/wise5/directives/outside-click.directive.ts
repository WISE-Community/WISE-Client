import { Directive, EventEmitter, HostListener, Output, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[outsideClick]',
  standalone: true
})
export class OutsideClickDirective {
  @Output() outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private dialog: MatDialog
  ) {}

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    if (
      !this.elementRef.nativeElement.contains(event.target) &&
      this.dialog.openDialogs.length == 0
    ) {
      this.outsideClick.emit(event);
    }
  }
}
