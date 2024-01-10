import { ClassroomMonitorTestHelper } from '../../shared/testing/ClassroomMonitorTestHelper';

export class NodeGradingViewComponentTestHelper extends ClassroomMonitorTestHelper {
  statusNoWork: number = 0;
  statusPartiallyCompleted: number = 1;
  statusCompleted: number = 2;
  notVisible: number = 0;
  visible: number = 1;
}
