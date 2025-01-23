import { CRaterIdea } from './CRaterIdea';

export class CRaterRubric {
  private ideas: CRaterIdea[] = [];

  constructor(rubric: any = { ideas: [] }) {
    this.ideas = rubric.ideas;
  }

  getStudentTextForIdea(ideaId: string): string {
    return this.ideas.find((idea) => idea.name === ideaId)?.studentText ?? ideaId;
  }
}
