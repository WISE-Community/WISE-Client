import { Component, Input } from '@angular/core';
import { ConstraintsAuthoringComponent } from '../../../assets/wise5/authoringTool/constraint/constraints-authoring/constraints-authoring.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ComponentConstraintAuthoringComponent } from '../../../assets/wise5/authoringTool/constraint/component-constraint-authoring/component-constraint-authoring.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';

@Component({
  imports: [
    CommonModule,
    ComponentConstraintAuthoringComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'edit-component-constraints',
  standalone: true,
  styleUrl: './edit-component-constraints.component.scss',
  templateUrl: './edit-component-constraints.component.html'
})
export class EditComponentConstraintsComponent extends ConstraintsAuthoringComponent {
  @Input() componentContent: ComponentContent;

  ngOnInit(): void {
    if (this.componentContent.constraints == null) {
      this.componentContent.constraints = [];
    }
    this.content = this.componentContent;
  }
}
