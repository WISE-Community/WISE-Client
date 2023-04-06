import { ComponentStatus } from '../../../../common/ComponentStatus';
import { calculateComponentVisibility } from './grading-helpers';

const componentId1 = 'component1';
const componentId2 = 'component2';
const componentId3 = 'component3';

describe('calculateComponentVisibility()', () => {
  describe(`when there is a visible component, a component with no work, and a component that is not
    visible`, () => {
    it('should calculate component visibility correctly', () => {
      const componentIdToHasWork = {};
      componentIdToHasWork[componentId1] = true;
      componentIdToHasWork[componentId2] = false;
      componentIdToHasWork[componentId3] = true;
      const componentStatuses = {};
      componentStatuses[componentId1] = new ComponentStatus(true, true);
      componentStatuses[componentId2] = new ComponentStatus(true, true);
      componentStatuses[componentId3] = new ComponentStatus(false, false);
      const componentVisibility = calculateComponentVisibility(
        componentIdToHasWork,
        componentStatuses
      );
      expect(componentVisibility[componentId1]).toEqual(true);
      expect(componentVisibility[componentId2]).toEqual(false);
      expect(componentVisibility[componentId3]).toEqual(false);
    });
  });
});
