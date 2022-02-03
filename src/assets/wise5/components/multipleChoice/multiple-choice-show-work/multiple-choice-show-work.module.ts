import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MultipleChoiceShowWorkComponent } from './multiple-choice-show-work.component';

@NgModule({
  declarations: [MultipleChoiceShowWorkComponent],
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatRadioModule],
  exports: [MultipleChoiceShowWorkComponent]
})
export class MultipleChoiceShowWorkModule {}
