import { Component } from '@angular/core';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SummaryService } from '../../components/summary/summaryService';
import { SummaryDisplay } from '../summary-display/summary-display.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  imports: [CommonModule, HighchartsChartModule, MatCardModule],
  selector: 'teacher-summary-display',
  standalone: true,
  styleUrl: '../summary-display/summary-display.component.scss',
  templateUrl: '../summary-display/summary-display.component.html'
})
export class TeacherSummaryDisplayComponent extends SummaryDisplay {
  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected projectService: ProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }
}
