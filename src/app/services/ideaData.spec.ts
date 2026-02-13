import {
  IdeaData,
  sortIdeasByCount,
  sortIdeasById
} from '../../assets/wise5/components/common/cRater/IdeaData';
import { TestBed } from '@angular/core/testing';

let ideas: IdeaData[];
describe('IdeaData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    ideas = [
      createIdeaData('2', 'c', 3),
      createIdeaData('1', 'b', 1),
      createIdeaData('2b', 'a', 4),
      createIdeaData('10a', 'abc', 2),
      createIdeaData('11', 'cba', 5)
    ];
  });

  test_SortIdeasByCount();
  test_SortIdeasById();
});

function test_SortIdeasByCount() {
  it('should sort ideas descending numerically by count', () => {
    const sortedIdeas = sortIdeasByCount(ideas);
    expect(sortedIdeas.map((idea) => idea.id)).toEqual(['11', '2b', '2', '10a', '1']);
  });
}

function test_SortIdeasById() {
  it('should sort ideas alphanumerically by ID', () => {
    const sortedIdeas = sortIdeasById(ideas);
    expect(sortedIdeas.map((ideas) => ideas.id)).toEqual(['1', '2', '2b', '10a', '11']);
  });
}

function createIdeaData(id: string, text: string, count: number): any {
  return {
    id: id,
    text: text,
    count: count
  };
}
