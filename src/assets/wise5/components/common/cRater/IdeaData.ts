import { CRaterIdea } from './CRaterIdea';

export type IdeaData = {
  id: string;
  text: string;
  count: number;
};

export function ideaDataToCRaterIdea(ideaData: IdeaData): CRaterIdea {
  return new CRaterIdea(ideaData.id, undefined, ideaData.text);
}

export function cRaterIdeaToIdeaData(cRaterIdea: CRaterIdea): IdeaData {
  return { id: cRaterIdea.name, text: cRaterIdea.text, count: 0 };
}
