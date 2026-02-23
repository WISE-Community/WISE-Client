import { arrayContainsAll } from '../../../common/array/array';
import { CRaterIdea } from './CRaterIdea';

export class CRaterRubric {
  description: string = '';
  ideas: CRaterIdea[] = [];
  ideasSummaryGroups?: any;
  ideaColors?: { tags: string[]; colorValue: string }[];

  constructor(rubric: any = { description: '', ideas: [] }) {
    this.description = rubric.description;
    this.ideas = rubric.ideas;
    this.ideasSummaryGroups = rubric.ideasSummaryGroups ?? DEFAULT_IDEAS_SUMMARY_GROUPS;
    this.ideaColors = rubric.ideaColors;
  }

  getIdea(ideaId: string): CRaterIdea {
    return this.ideas.find((idea) => idea.name === ideaId);
  }

  getIdeaTags(ideaId: string): string[] {
    return this.getIdea(ideaId)?.tags ?? [];
  }

  hasIdeaDescriptionText(ideaId: string): boolean {
    return this.getIdea(ideaId)?.text != null;
  }

  getIdeaDescriptionText(ideaId: string): string {
    return this.getIdea(ideaId)?.text ?? 'idea ' + ideaId;
  }

  getIdeaColor(ideaId: string): string {
    const ideaTags = this.getIdeaTags(ideaId);
    return (
      this.ideaColors?.find((ideaColor) => arrayContainsAll(ideaTags, ideaColor.tags))
        ?.colorValue ?? ''
    );
  }

  hasRubricData(): boolean {
    return (this.description ?? '') !== '' || this.ideas.length > 0;
  }

  getInitialIdeasSummaryGroups(): any[] {
    return this.ideasSummaryGroups.initial;
  }

  getAdditionalIdeasSummaryGroups(): any[] {
    return this.ideasSummaryGroups.additional;
  }

  getUniqueIdeas(responses: any[]): CRaterIdea[] {
    const uniqueIdeas: CRaterIdea[] = [];
    responses.forEach((response) =>
      response.ideas
        ?.filter(
          (idea) =>
            idea.detected &&
            this.hasIdeaDescriptionText(idea.name) &&
            !uniqueIdeas.some((uniqueIdea) => uniqueIdea.name === idea.name)
        )
        .forEach((idea) => {
          const cRaterIdea = new CRaterIdea(idea.name, true);
          const cRaterRubricIdea = this.getIdea(idea.name);
          cRaterIdea.text = cRaterRubricIdea?.text ?? idea.name;
          uniqueIdeas.push(cRaterIdea);
        })
    );
    return uniqueIdeas;
  }
}

export const DEFAULT_IDEAS_SUMMARY_GROUPS = {
  initial: [
    {
      maxIdeas: 3,
      title: $localize`Most Common`,
      tags: [],
      sort: {
        field: 'count',
        order: 'desc'
      }
    },
    {
      maxIdeas: 3,
      title: $localize`Unique Ideas`,
      tags: [],
      sort: {
        field: 'count',
        order: 'asc'
      }
    }
  ],
  additional: [
    {
      title: $localize`All Ideas`,
      tags: [],
      sort: {
        field: 'count',
        order: 'desc'
      },
      showUndetectedIdeas: true
    }
  ]
};
