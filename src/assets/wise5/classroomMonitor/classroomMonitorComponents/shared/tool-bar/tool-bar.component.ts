import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  @Output() onMenuToggle: EventEmitter<any> = new EventEmitter<any>();
  @Input() showPeriodSelect: boolean;
  @Input() showStepTools: boolean;
  @Input() showTeamTools: boolean;
  showTitle: boolean;
  @Input() viewName: string;
  @Input() workgroupId: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.showTitle = !this.showStepTools && !this.showTeamTools;
  }

  toggleMenu() {
    this.onMenuToggle.emit();
  }
}
