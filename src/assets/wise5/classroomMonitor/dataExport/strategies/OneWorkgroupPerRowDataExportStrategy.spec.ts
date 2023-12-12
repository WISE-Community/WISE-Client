import { TeacherProjectService } from '../../../services/teacherProjectService';
import { OneWorkgroupPerRowDataExportStrategy } from './OneWorkgroupPerRowDataExportStrategy';

const strategy = new OneWorkgroupPerRowDataExportStrategy();
class MockProjectService {
  getNodePositionById(nodeId: string): string {
    return { node1: '1.1', node2: '1.2A', node3: '1.2B' }[nodeId];
  }
}
describe('OneWorkgroupPerRowDataExportStrategy', () => {
  describe('getBranchLetter()', () => {
    it('gets the branch letter', () => {
      strategy.projectService = new MockProjectService() as TeacherProjectService;
      expect(strategy.getBranchLetter('node1')).toEqual(null);
      expect(strategy.getBranchLetter('node2')).toEqual('A');
      expect(strategy.getBranchLetter('node3')).toEqual('B');
      expect(strategy.getBranchLetter('node4')).toEqual(null);
    });
  });
});
