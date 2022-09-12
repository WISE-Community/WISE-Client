import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Output() goToView: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: any;
  @Input() views: any;

  constructor() {}

  ngOnInit(): void {}
}
