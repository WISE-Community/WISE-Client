import { CRaterRubric } from './CRaterRubric';

const responses = [
  {
    ideas: [
      { name: 'idea1', detected: true },
      { name: 'idea2', detected: false },
      { name: 'idea3', detected: false },
      { name: 'idea4', detected: false }
    ]
  },
  {
    ideas: [
      { name: 'idea1', detected: true },
      { name: 'idea2', detected: true },
      { name: 'idea3', detected: false },
      { name: 'idea4', detected: true }
    ]
  }
];
const rubric = new CRaterRubric({
  ideas: [
    { name: 'idea1', text: 'idea1 description' },
    { name: 'idea2', text: 'idea2 description' },
    { name: 'idea3', text: 'idea3 description' },
    { name: 'idea5', text: 'idea5 description' }
  ]
});

describe('CRaterRubric', () => {
  describe('getUniqueIdeas', () => {
    it('should return unique ideas that are in the rubric', () => {
      // idea 4 is detected but not in the rubric, so should be omitted
      const ideas = rubric.getUniqueIdeas(responses);
      expect(ideas.length).toEqual(2);
      expect(ideas.map((idea) => idea.name)).toEqual(['idea1', 'idea2']);
    });
  });

  describe('hasAnyIdeaTags', () => {
    it('should return false when rubric has no ideas or ideas have no tags', () => {
      const emptyRubric = new CRaterRubric({ ideas: [] });
      expect(emptyRubric.hasAnyIdeaTags()).toBe(false);

      const noTagsRubric = new CRaterRubric({
        ideas: [
          { name: 'idea1', text: 'description 1' },
          { name: 'idea2', text: 'description 2', tags: [] }
        ]
      });
      expect(noTagsRubric.hasAnyIdeaTags()).toBe(false);
    });

    it('should return true when at least one idea has tags', () => {
      const withTagsRubric = new CRaterRubric({
        ideas: [
          { name: 'idea1', text: 'description 1', tags: [] },
          { name: 'idea2', text: 'description 2', tags: ['mechanistic'] }
        ]
      });
      expect(withTagsRubric.hasAnyIdeaTags()).toBe(true);
    });
  });
});
