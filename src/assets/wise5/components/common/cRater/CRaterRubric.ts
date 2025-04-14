import { CRaterIdea } from './CRaterIdea';

export class CRaterRubric {
  private description: string;
  private ideas: CRaterIdea[] = [];

  constructor(rubric: any = { description: '', ideas: [] }) {
    this.description = rubric.description;
    this.ideas = rubric.ideas;
  }

  getDescription(): string {
    return this.description;
  }

  getIdea(ideaId: string): CRaterIdea {
    return this.ideas.find((idea) => idea.name === ideaId);
  }

  getIdeas(): CRaterIdea[] {
    return this.ideas;
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
