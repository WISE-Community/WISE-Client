import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'edit-component-max-submit',
  templateUrl: './edit-component-max-submit.component.html',
  styleUrls: ['./edit-component-max-submit.component.scss']
})
export class EditComponentMaxSubmitComponent implements OnInit {
  @Input()
  maxSubmitCount: number;

  @Output()
  maxSubmitCountChange: EventEmitter<number> = new EventEmitter<number>();

  maxSubmitCountDebouncer: Subject<number> = new Subject<number>();
  maxSubmitCountDebouncerSubscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.maxSubmitCountDebouncerSubscription = this.maxSubmitCountDebouncer
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.maxSubmitCountChange.emit(this.maxSubmitCount);
      });
  }

  ngOnDestroy(): void {
    this.maxSubmitCountDebouncerSubscription.unsubscribe();
  }
}
