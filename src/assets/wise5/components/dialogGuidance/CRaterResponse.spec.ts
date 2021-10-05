import { CRaterResponse } from './CRaterResponse';

const response = new CRaterResponse();
describe('CRaterResponse', () => {
  getDetectedIdeaNames();
  getKIScore();
  isNonScorable();
});

function getDetectedIdeaNames() {
  describe('getDetectedIdeaNames()', () => {
    it('should return ideas that were detected in the response', () => {
      response.ideas = [
        { name: 'idea1', detected: true, characterOffsets: [] },
        { name: 'idea2', detected: false, characterOffsets: [] },
        { name: 'idea3', detected: true, characterOffsets: [] }
      ];
      expect(response.getDetectedIdeaNames()).toEqual(['idea1', 'idea3']);
    });
  });
}

function getKIScore() {
  describe('getKIScore()', () => {
    it('should return the KI score', () => {
      response.scores = [{ id: 'ki', score: 2, realNumberScore: 2.13 }];
      expect(response.getKIScore()).toEqual(2);
    });
  });
}

function isNonScorable() {
  describe('isNonScorable()', () => {
    it('should return true for non-scorable item and false for scorable item', () => {
      response.scores = [{ id: 'nonscorable', score: 1, realNumberScore: 1 }];
      expect(response.isNonScorable()).toBeTruthy();
      response.scores = [{ id: 'nonscorable', score: 0, realNumberScore: 0 }];
      expect(response.isNonScorable()).toBeFalsy();
    });
  });
}
