import { IdeasSummaryDataPoint } from './IdeasSummaryDataPoint';

export abstract class IdeasSummaryData {
  protected dataPoints: IdeasSummaryDataPoint[];

  constructor() {
    this.dataPoints = [];
  }

  getIdeaCountMap(): Map<string, number> {
    const ideaCountMap = new Map<string, number>();
    this.dataPoints.forEach((dataPoint) => {
      dataPoint.getDetectedIdeaIds().forEach((ideaId) => {
        if (ideaCountMap.has(ideaId)) {
          ideaCountMap.set(ideaId, ideaCountMap.get(ideaId) + 1);
        } else {
          ideaCountMap.set(ideaId, 1);
        }
      });
      dataPoint.getAllIdeaIds().forEach((ideaId) => {
        if (!ideaCountMap.has(ideaId)) {
          ideaCountMap.set(ideaId, 0);
        }
      });
    });
    return ideaCountMap;
  }
}
