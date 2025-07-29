import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MatCardModule, RouterModule],
  templateUrl: './survey-completed.component.html',
  selector: 'survey-completed',
  styleUrl: './survey-completed.component.scss'
})
export class SurveyCompletedComponent {}
