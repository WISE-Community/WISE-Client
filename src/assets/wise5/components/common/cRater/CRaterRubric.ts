import { CRaterIdea } from './CRaterIdea';

export class CRaterRubric {
  private ideas: CRaterIdea[] = [];

  constructor(rubric: any = { ideas: [] }) {
    this.ideas = rubric.ideas;
  }

  getStudentTextForIdea(ideaId: string): string {
    return this.ideas.find((idea) => idea.name === ideaId)?.studentText ?? ideaId;
  }

  getTeacherTextForIdea(ideaId: string): string {
    return this.ideas.find((idea) => idea.name === ideaId)?.teacherText ?? ideaId;
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
        cRaterIdea.studentText = rubric.getStudentTextForIdea(idea.name);
        cRaterIdea.teacherText = rubric.getTeacherTextForIdea(idea.name);
        uniqueIdeas.push(cRaterIdea);
      })
  );
  return uniqueIdeas;
}
