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

  hasRubricData(): boolean {
    return (this.description ?? '') !== '' || this.ideas.length > 0;
  }

  getInitialIdeaSummaryGroups(): any[] {
    return this.ideasSummaryGroups.initial;
  }

  getAdditionalIdeaSummaryGroups(): any[] {
    return this.ideasSummaryGroups.additional;
  }
}

export function getUniqueIdeas(responses: any[], rubric: CRaterRubric): CRaterIdea[] {
  const uniqueIdeas: CRaterIdea[] = [];
  responses.forEach((response) =>
    response.ideas
      ?.filter(
        (idea) => idea.detected && !uniqueIdeas.some((uniqueIdea) => uniqueIdea.name === idea.name)
      )
      .forEach((idea) => {
        const cRaterIdea = new CRaterIdea(idea.name, true);
        const cRaterRubricIdea = rubric.getIdea(idea.name);
        cRaterIdea.text = cRaterRubricIdea?.text ?? idea.name;
        uniqueIdeas.push(cRaterIdea);
      })
  );
  return uniqueIdeas;
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
