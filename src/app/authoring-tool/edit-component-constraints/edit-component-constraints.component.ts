import { Component, Input } from '@angular/core';
import { ConstraintsAuthoringComponent } from '../../../assets/wise5/authoringTool/constraint/constraints-authoring/constraints-authoring.component';

@Component({
  selector: 'edit-component-constraints',
  templateUrl: './edit-component-constraints.component.html',
  styleUrls: ['./edit-component-constraints.component.scss']
})
export class EditComponentConstraintsComponent extends ConstraintsAuthoringComponent {
  @Input() componentContent: any;

  ngOnInit(): void {
    if (this.componentContent.constraints == null) {
      this.componentContent.constraints = [];
    }
    this.content = this.componentContent;
  }
}
