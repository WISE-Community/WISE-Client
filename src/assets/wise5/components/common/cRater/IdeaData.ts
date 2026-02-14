import { CRaterIdea } from './CRaterIdea';

export type IdeaData = {
  id: string;
  text: string;
  count: number;
  tags?: string[];
  color?: string;
};

export function ideaDataToCRaterIdea(ideaData: IdeaData): CRaterIdea {
  return new CRaterIdea(ideaData.id, undefined, ideaData.text, ideaData.tags);
}

export function cRaterIdeaToIdeaData(cRaterIdea: CRaterIdea): IdeaData {
  return { id: cRaterIdea.name, text: cRaterIdea.text, count: 0, tags: cRaterIdea.tags };
}

export function sortIdeasByCount(ideas: IdeaData[], sortOrder: 'asc' | 'desc'): IdeaData[] {
  return ideas.sort((a, b) => (sortOrder === 'asc' ? a.count - b.count : b.count - a.count));
}

export function sortIdeasById(ideas: IdeaData[]): IdeaData[] {
  const sorted = ideas
    .filter((idea) => !stringContainsLetters(idea.id))
    .sort((a, b) => Number(a.id) - Number(b.id));
  const sortedIdeasWithLetters = getSortedIdeasWithLetters(ideas);
  return insertIdeasWithLetters(sorted, sortedIdeasWithLetters);
}

function getSortedIdeasWithLetters(ideas: IdeaData[]): IdeaData[] {
  return ideas
    .filter((idea) => stringContainsLetters(idea.id))
    .sort((a, b) => compareByStringNumericPrefix(a, b));
}

function stringContainsLetters(str: string): boolean {
  return Array.from(str).some((char) => isNaN(Number(char)));
}

function compareByStringNumericPrefix(idea: IdeaData, otherIdea: IdeaData): number {
  const prefixDif = stringNumericPrefix(idea.id) - stringNumericPrefix(otherIdea.id);
  return prefixDif === 0 ? idea.id.localeCompare(otherIdea.id) : prefixDif;
}

function insertIdeasWithLetters(
  sorted: IdeaData[],
  sortedIdeasWithLetters: IdeaData[]
): IdeaData[] {
  for (let i = 0; i < sorted.length; i++) {
    while (
      sortedIdeasWithLetters.length > 0 &&
      Number(sorted.at(i).id) > stringNumericPrefix(sortedIdeasWithLetters.at(0).id)
    ) {
      const ideaWithLetter = sortedIdeasWithLetters.at(0);
      sortedIdeasWithLetters = sortedIdeasWithLetters.slice(1, sortedIdeasWithLetters.length);
      sorted.splice(i, 0, ideaWithLetter);
      i++;
    }
  }
  return sorted;
}

function stringNumericPrefix(str: string): number {
  let numericPrefix = '';
  const strArray = Array.from(str);
  for (let charIndex = 0; charIndex < strArray.length; charIndex++) {
    const char = strArray.at(charIndex);
    if (isNaN(Number(char))) {
      break;
    } else {
      numericPrefix = numericPrefix.concat(char);
    }
  }
  return Number(numericPrefix);
}
