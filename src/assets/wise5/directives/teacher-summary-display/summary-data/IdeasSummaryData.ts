import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { IdeaData } from '../../../components/common/cRater/IdeaData';
import { IdeasSummaryDataPoint } from './IdeasSummaryDataPoint';

export abstract class IdeasSummaryData {
  protected dataPoints: IdeasSummaryDataPoint[] = [];
  protected rubric: CRaterRubric;

  constructor(rubric: CRaterRubric) {
    this.rubric = rubric;
  }

  hasAnyDetectedIdeas(): boolean {
    return Array.from(this.getIdeaCountMap().values()).some((value) => value > 0);
  }

  getIdeaDataArray(): IdeaData[] {
    const ideaDataArray = [];
    this.getIdeaCountMap().forEach((count, ideaId) => {
      ideaDataArray.push({
        id: ideaId,
        text: this.getIdeaDescriptionText(ideaId),
        count: count
      });
    });
    return ideaDataArray;
  }

  private getIdeaCountMap(): Map<string, number> {
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

  private getIdeaDescriptionText(ideaId: string): string {
    return (
      this.rubric.ideas.find((ideaDescription) => ideaDescription.name === ideaId)?.text ??
      'idea ' + ideaId
    );
  }
}
