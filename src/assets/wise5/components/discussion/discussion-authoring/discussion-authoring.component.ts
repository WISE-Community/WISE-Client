import { Component, OnInit } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { generateRandomKey } from '../../../common/string/string';

@Component({
  imports: [
    EditComponentPrompt,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  styles: ['mat-checkbox { display: block; }'],
  templateUrl: 'discussion-authoring.component.html'
})
export class DiscussionAuthoring extends AbstractComponentAuthoring implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.componentContent.presentation) {
      this.componentContent.presentation = {
        prompt: '',
        reflectionQuestions: []
      };
    } else if (!this.componentContent.presentation.reflectionQuestions) {
      this.componentContent.presentation.reflectionQuestions = [];
    }
  }

  addReflectionQuestion(): void {
    if (!this.componentContent.presentation) {
      this.componentContent.presentation = { prompt: '', reflectionQuestions: [] };
    }
    if (!this.componentContent.presentation.reflectionQuestions) {
      this.componentContent.presentation.reflectionQuestions = [];
    }
    this.componentContent.presentation.reflectionQuestions.push({
      id: generateRandomKey(),
      text: ''
    });
    this.componentChanged();
  }

  deleteReflectionQuestion(index: number): void {
    if (this.componentContent.presentation?.reflectionQuestions) {
      this.componentContent.presentation.reflectionQuestions.splice(index, 1);
      this.componentChanged();
    }
  }
}
