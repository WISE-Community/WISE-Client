import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { DataExportComponent } from './data-export.component';
import { provideRouter } from '@angular/router';

let component: DataExportComponent;
let fixture: ComponentFixture<DataExportComponent>;
const group0Id = 'group0';
const group1Id = 'group1';
const node1Id = 'node1';
const node2Id = 'node2';
const component1Id = 'component1';
const component2Id = 'component2';
const component3Id = 'component3';
const group0 = createGroup(group0Id, [group1Id]);
const group1 = createGroup(group1Id, [node1Id, node2Id]);
const component1 = createComponent(component1Id);
const component2 = createComponent(component2Id);
const component3 = createComponent(component3Id);
const node1 = createNode(node1Id, [component1, component2]);
const node2 = createNode(node2Id, [component3]);
const group0ProjectItem = createProjectItem(group0, 0);
const group1ProjectItem = createProjectItem(group1, 1);
const node1ProjectItem = createProjectItem(node1, 2);
const node2ProjectItem = createProjectItem(node2, 3);

describe('DataExportComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataExportComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [DataExportService, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    spyOn(TestBed.inject(TeacherProjectService), 'cleanupBeforeSave').and.callFake(() => {});
    const idToOrder = {};
    idToOrder[group0Id] = group0ProjectItem;
    idToOrder[group1Id] = group1ProjectItem;
    idToOrder[node1Id] = node1ProjectItem;
    idToOrder[node2Id] = node2ProjectItem;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeOrderOfProject').and.returnValue({
      idToOrder: idToOrder,
      nodes: [group0ProjectItem, group1ProjectItem, node1ProjectItem, node2ProjectItem]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue(
      []
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createProjectItem(node: any, order: number) {
  return {
    node: node,
    order: order
  };
}

function createGroup(id: string, ids: string[]): any {
  return {
    id: id,
    ids: ids,
    type: 'group'
  };
}

function createNode(id: string, components: any[]): any {
  return {
    components: components,
    id: id,
    type: 'node'
  };
}

function createComponent(id: string): any {
  return {
    id: id
  };
}
