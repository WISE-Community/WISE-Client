import { Directive, EventEmitter, HostListener, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[outsideClick]',
  standalone: true
})
export class OutsideClickDirective {
  @Output() outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.outsideClick.emit(event);
    }
  }
}
