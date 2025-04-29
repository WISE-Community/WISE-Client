import { Component } from '@angular/core';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { SummaryService } from '../../../components/summary/summaryService';
import { MatchSummaryData } from '../summary-data/MatchSummaryData';
import { MatchSummaryDataPoint } from '../summary-data/MatchSummaryDataPoint';
import { SummaryDataPoint } from '../../summary-display/summary-data/SummaryDataPoint';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'match-summary-display',
  imports: [CommonModule],
  templateUrl: './match-summary-display.component.html',
  styleUrl: './match-summary-display.component.scss'
})
export class MatchSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  private matchSummaryData: MatchSummaryData;
  private bucketValues: Set<string> = new Set<string>();

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(annotationService, configService, dataService, projectService, summaryService);
  }

  ngOnInit(): void {
    this.getLatestWork().subscribe((componentStates) => {
      this.matchSummaryData = new MatchSummaryData(componentStates);
      this.matchSummaryData
        .getDataPoints()
        .map(this.asMatchSummaryDataPoint)
        .forEach((data) => {
          this.bucketValues.add(data.getBucketValue());
        });
    });
  }

  protected getBucketData(): { value: string; choices: MatchSummaryDataPoint[] }[] {
    const buckets: { value: string; choices: MatchSummaryDataPoint[] }[] = [];
    this.bucketValues.forEach((bucketValue) =>
      buckets.push({ value: bucketValue, choices: this.getBucketDataByValue(bucketValue) })
    );
    return buckets;
  }

  private getBucketDataByValue(value: string): MatchSummaryDataPoint[] {
    return this.matchSummaryData
      .getDataPoints()
      .map(this.asMatchSummaryDataPoint)
      .filter((choice) => choice.getBucketValue() === value);
  }

  private asMatchSummaryDataPoint(dataPoint: SummaryDataPoint): MatchSummaryDataPoint {
    return dataPoint as MatchSummaryDataPoint;
  }
}
