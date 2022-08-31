import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';
import { GroupTabsComponent } from './group-tabs.component';

const group1 = { id: 'group1' };
const group2 = { id: 'group2' };
const node1 = { id: 'node1' };
class MockVLEProjectService {
  rootNode = {
    ids: ['group1', 'group2']
  };
  getNodeById(id: string): any {
    return id === 'group1' ? group1 : group2;
  }
  getParentGroup(): any {
    return group1;
  }
  getGroupStartId(): any {
    return 'node1';
  }
}

class MockStudentDataService {
  currentNodeChanged$ = of(null);
  getCurrentNode(): any {
    return node1;
  }
}

let component: GroupTabsComponent;
let projectService: VLEProjectService;
describe('GroupTabsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupTabsComponent,
        { provide: VLEProjectService, useClass: MockVLEProjectService },
        { provide: StudentDataService, useClass: MockStudentDataService }
      ]
    });
    component = TestBed.inject(GroupTabsComponent);
    projectService = TestBed.inject(VLEProjectService);
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should initialize class variables', () => {
      component.ngOnInit();
      expect(component.groupNodes.length).toEqual(2);
      expect(component.selectedTabIndex).toEqual(0);
    });
  });
}
