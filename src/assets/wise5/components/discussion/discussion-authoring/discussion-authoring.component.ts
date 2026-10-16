import { Component, OnInit } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  imports: [
    EditComponentPrompt,
    FormsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule
  ],
  styles: ['mat-checkbox { display: block; }'],
  templateUrl: 'discussion-authoring.component.html'
})
export class DiscussionAuthoring extends AbstractComponentAuthoring implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.componentContent.teacher) {
      this.componentContent.teacher = {
        presentation: {
          prompt: this.componentContent.presentation?.prompt || ''
        }
      };
    } else if (!this.componentContent.teacher.presentation) {
      this.componentContent.teacher.presentation = {
        prompt: this.componentContent.presentation?.prompt || ''
      };
    }
  }
}
