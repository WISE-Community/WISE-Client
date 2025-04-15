import { Injectable } from '@angular/core';

export type IdeaData = {
  id: string;
  text: string;
  count: number;
};

@Injectable()
export class IdeasSortingService {
  sortByCount(ideas: IdeaData[]): IdeaData[] {
    return ideas.filter((idea) => idea.count > 0).sort((a, b) => b.count - a.count);
  }

  sortById(ideas: IdeaData[]): IdeaData[] {
    let sorted = ideas
      .filter((idea) => !this.stringContainsLetters(idea.id))
      .sort((a, b) => Number(a.id) - Number(b.id));
    const sortedIdeasWithLetters = this.getSortedIdeasWithLetters(ideas);
    return this.insertIdeasWithLetters(sorted, sortedIdeasWithLetters);
  }

  private getSortedIdeasWithLetters(ideas: IdeaData[]): IdeaData[] {
    return ideas
      .filter((idea) => this.stringContainsLetters(idea.id))
      .sort((a, b) => this.compareByStringNumericPrefix(a, b));
  }

  private stringContainsLetters(str: string): boolean {
    return Array.from(str).some((char) => isNaN(Number(char)));
  }

  private compareByStringNumericPrefix(idea: IdeaData, otherIdea: IdeaData): number {
    const prefixDif = this.stringNumericPrefix(idea.id) - this.stringNumericPrefix(otherIdea.id);
    return prefixDif === 0 ? idea.id.localeCompare(otherIdea.id) : prefixDif;
  }

  private insertIdeasWithLetters(
    sorted: IdeaData[],
    sortedIdeasWithLetters: IdeaData[]
  ): IdeaData[] {
    for (let i = 0; i < sorted.length; i++) {
      while (
        sortedIdeasWithLetters.length > 0 &&
        Number(sorted.at(i).id) > this.stringNumericPrefix(sortedIdeasWithLetters.at(0).id)
      ) {
        const ideaWithLetter = sortedIdeasWithLetters.at(0);
        sortedIdeasWithLetters = sortedIdeasWithLetters.slice(1, sortedIdeasWithLetters.length);
        sorted.splice(i, 0, ideaWithLetter);
        i++;
      }
    }
    return sorted;
  }

  private stringNumericPrefix(str: string): number {
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
}
