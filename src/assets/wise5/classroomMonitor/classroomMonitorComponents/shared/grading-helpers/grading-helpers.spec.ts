import { ComponentStatus } from '../../../../common/ComponentStatus';
import { calculateComponentVisibility } from './grading-helpers';

const component1 = { id: 'component1', type: 'OpenResponse' };
const component2 = { id: 'component2', type: 'HTML' };
const component3 = { id: 'component3', type: 'OpenResponse' };

describe('calculateComponentVisibility()', () => {
  describe(`when there is a visible component, a component with no work, and a component that is not
    visible`, () => {
    it('should calculate component visibility correctly', () => {
      const components = [component1, component2, component3];
      const componentIdToHasWork = {
        component1: true,
        component2: false,
        component3: true
      };
      const componentStatuses = {
        component1: new ComponentStatus(true, true),
        component2: new ComponentStatus(true, true),
        component3: new ComponentStatus(false, false)
      };
      const componentVisibility = calculateComponentVisibility(
        components,
        componentIdToHasWork,
        componentStatuses
      );
      expect(componentVisibility[component1.id]).toEqual(true);
      expect(componentVisibility[component2.id]).toEqual(false);
      expect(componentVisibility[component3.id]).toEqual(false);
    });
  });
});
