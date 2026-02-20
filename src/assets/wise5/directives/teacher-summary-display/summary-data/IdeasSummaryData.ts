import { arrayContainsAll } from '../../../common/array/array';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { IdeaData, sortIdeasByCount } from '../../../components/common/cRater/IdeaData';
import { IdeasSummaryDataPoint } from './IdeasSummaryDataPoint';

export interface IdeaGroup {
  title: string;
  ideas: IdeaData[];
}

export abstract class IdeasSummaryData {
  protected dataPoints: IdeasSummaryDataPoint[] = [];
  protected ideaDataArray: IdeaData[] = [];
  protected rubric: CRaterRubric;

  constructor(rubric: CRaterRubric) {
    this.rubric = rubric;
  }

  hasAnyDetectedIdeas(): boolean {
    return Array.from(this.getIdeaCountMap().values()).some((value) => value > 0);
  }

  protected setIdeaDataArray(): void {
    this.ideaDataArray = [];
    this.getIdeaCountMap().forEach((count, ideaId) => {
      this.ideaDataArray.push({
        id: ideaId,
        count: count,
        color: this.rubric.getIdeaColor(ideaId),
        tags: this.rubric.getIdeaTags(ideaId),
        text: this.rubric.getIdeaDescriptionText(ideaId)
      });
    });
  }

  private getIdeaCountMap(): Map<string, number> {
    const ideaCountMap = new Map<string, number>();
    this.dataPoints.forEach((dataPoint) => {
      dataPoint
        .getDetectedIdeaIds()
        .forEach((ideaId) => ideaCountMap.set(ideaId, (ideaCountMap.get(ideaId) ?? 0) + 1));
      dataPoint.getAllIdeaIds().forEach((ideaId) => {
        if (!ideaCountMap.has(ideaId)) {
          ideaCountMap.set(ideaId, 0);
        }
      });
    });
    return ideaCountMap;
  }

  getIdeasSummaryGroups(): [IdeaGroup[], IdeaGroup[]] {
    return [
      this.getIdeaGroups(this.rubric.getInitialIdeasSummaryGroups()),
      this.getIdeaGroups(this.rubric.getAdditionalIdeasSummaryGroups())
    ];
  }

  private getIdeaGroups(groups: any[]): IdeaGroup[] {
    return groups.map((group) => ({
      title: group.title,
      ideas: this.getIdeas(group)
    }));
  }

  private getIdeas(group: any): IdeaData[] {
    let ideas = this.getIdeasWithTags(group.tags);
    if (!group.showUndetectedIdeas) {
      ideas = ideas.filter((idea) => idea.count > 0);
    }
    ideas = ideas.filter((idea) => this.rubric.hasIdeaDescriptionText(idea.id));
    sortIdeasByCount(ideas, group.sort.order ?? 'desc');
    return ideas.slice(0, group.maxIdeas ?? ideas.length);
  }

  // get ideas that have at least the tags specified
  private getIdeasWithTags(tags: string[]): IdeaData[] {
    return this.ideaDataArray.filter((ideaData) => arrayContainsAll(ideaData.tags, tags));
  }
}
