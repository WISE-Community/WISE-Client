import { CRaterIdea } from './CRaterIdea';

export class CRaterRubric {
  private ideas: CRaterIdea[] = [];

  constructor(rubric: any = { ideas: [] }) {
    this.ideas = rubric.ideas;
  }

  getIdea(ideaId: string): CRaterIdea {
    return this.ideas.find((idea) => idea.name === ideaId);
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
