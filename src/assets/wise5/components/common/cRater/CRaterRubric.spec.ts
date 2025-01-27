import { CRaterRubric, getUniqueIdeas } from './CRaterRubric';

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
    { name: 'idea1' },
    { name: 'idea2' },
    { name: 'idea3' },
    { name: 'idea4' },
    { name: 'idea5' }
  ]
});

describe('CRaterRubric', () => {
  describe('getUniqueIdeas', () => {
    it('should return unique ideas', () => {
      expect(getUniqueIdeas(responses, rubric).length).toEqual(3);
    });
  });
});
