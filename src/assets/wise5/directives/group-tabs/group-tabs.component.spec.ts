import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NodeStatusService } from '../../services/nodeStatusService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';
import { GroupTabsComponent } from './group-tabs.component';
import { NodeService } from '../../services/nodeService';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const group1 = { id: 'group1', title: 'Lesson 1', startId: 'node1' };
const group2 = { id: 'group2', title: 'Lesson 2', startId: 'node2' };
const node1 = { id: 'node1' };

class MockNodeStatusService {
  canVisitNode(): boolean {
    return true;
  }
}

class MockNodeService {
  setCurrentNode(): void {}
}

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
  nodeStatusesChanged$ = of(null);
  getCurrentNode(): any {
    return node1;
  }
  canVisitNode(): boolean {
    return true;
  }
}

let component: GroupTabsComponent;
let fixture: ComponentFixture<GroupTabsComponent>;
let loader: HarnessLoader;
let projectService: VLEProjectService;
let tabGroup: MatTabGroupHarness;
describe('GroupTabsComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        GroupTabsComponent,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NodeStatusService, useClass: MockNodeStatusService },
        { provide: VLEProjectService, useClass: MockVLEProjectService },
        { provide: StudentDataService, useClass: MockStudentDataService }
      ]
    });
    fixture = TestBed.createComponent(GroupTabsComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(VLEProjectService);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    tabGroup = await loader.getHarness(MatTabGroupHarness);
  });
  ngOnInit();
  goToGroupTab();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should initialize class variables', async () => {
      expect((await tabGroup.getTabs()).length).toEqual(2);
      expect(await (await tabGroup.getSelectedTab()).getLabel()).toEqual('Lesson 1');
    });
  });
}

function goToGroupTab() {
  describe('goToGroupTab()', () => {
    it("should call function to set new group's startNodeId", async () => {
      const spy = spyOn(TestBed.inject(NodeService), 'setCurrentNode');
      await (await tabGroup.getTabs())[1].select();
      expect(spy).toHaveBeenCalledWith('node2');
    });
  });
}
