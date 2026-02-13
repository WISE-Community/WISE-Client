import { arrayContainsAll } from '../../../common/array/array';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import {
  IdeaData,
  sortIdeasByCount,
  sortIdeasById
} from '../../../components/common/cRater/IdeaData';
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
        text: this.getIdeaDescriptionText(ideaId),
        tags: this.getIdeaTags(ideaId),
        count: count
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

  private getIdeaDescriptionText(ideaId: string): string {
    return (
      this.rubric.ideas.find((ideaDescription) => ideaDescription.name === ideaId)?.text ??
      'idea ' + ideaId
    );
  }

  private getIdeaTags(ideaId: string): string[] {
    return this.rubric.ideas.find((ideaDescription) => ideaDescription.name === ideaId)?.tags ?? [];
  }

  getIdeasSummaryGroups(): [IdeaGroup[], IdeaGroup[]] {
    return this.rubric.hasIdeasSummaryGroups()
      ? [this.getInitialGroups(), this.getAdditionalGroups()]
      : this.getDefaultIdeasSummmaryGroups();
  }

  private getInitialGroups(): IdeaGroup[] {
    return this.rubric.ideasSummaryGroups.initial.map((group) => ({
      title: group.title,
      ideas: this.getIdeasWithTags(group.tags)
    }));
  }

  private getAdditionalGroups(): IdeaGroup[] {
    return this.rubric.ideasSummaryGroups.additional.map((group) => ({
      title: group.title,
      ideas: this.getIdeasWithTags(group.tags)
    }));
  }

  // get ideas that have at least the tags specified
  private getIdeasWithTags(tags: string[]): IdeaData[] {
    return this.ideaDataArray.filter((ideaData) => arrayContainsAll(ideaData.tags, tags));
  }

  private getDefaultIdeasSummmaryGroups(): [IdeaGroup[], IdeaGroup[]] {
    const sortedIdeas = sortIdeasByCount(this.ideaDataArray);
    const mostCommonIdeas = [...sortedIdeas].splice(0, 3);
    const leastCommonIdeas =
      sortedIdeas.length <= 3
        ? [...sortedIdeas].splice(0, 3).reverse()
        : [...sortedIdeas].splice(sortedIdeas.length - 3, sortedIdeas.length).reverse();
    const initialGroups = [
      {
        title: $localize`Most Common`,
        ideas: mostCommonIdeas
      },
      {
        title: $localize`Least Common`,
        ideas: leastCommonIdeas
      }
    ];
    const additionalGroups = [
      {
        title: $localize`All Ideas`,
        ideas: sortIdeasById(this.ideaDataArray)
      }
    ];
    return [initialGroups, additionalGroups];
  }
}
