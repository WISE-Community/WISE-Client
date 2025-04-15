import { TestBed } from '@angular/core/testing';
import { IdeaData, IdeasSortingService } from '../../assets/wise5/services/ideasSortingService';

let ideas: IdeaData[];
let service: IdeasSortingService;

describe('IdeasSortingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdeasSortingService]
    });
    ideas = [
      createIdeaData('2', 'c', 3),
      createIdeaData('1', 'b', 1),
      createIdeaData('2b', 'a', 4),
      createIdeaData('10a', 'abc', 2),
      createIdeaData('11', 'cba', 5)
    ];
    service = TestBed.inject(IdeasSortingService);
  });

  sortIdeasByCount();
  sortIdeasById();
});

function sortIdeasByCount() {
  it('should sort ideas descending numerically by count', () => {
    const sortedIdeas = service.sortByCount(ideas);
    expect(sortedIdeas.map((idea) => idea.id)).toEqual(['11', '2b', '2', '10a', '1']);
  });
}

function sortIdeasById() {
  it('should sort ideas alphanumerically by ID', () => {
    const sortedIdeas = service.sortById(ideas);
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
