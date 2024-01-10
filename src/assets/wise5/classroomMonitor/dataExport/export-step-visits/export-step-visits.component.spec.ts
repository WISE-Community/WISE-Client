import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ExportStepVisitsComponent } from './export-step-visits.component';

let component: ExportStepVisitsComponent;
let fixture: ComponentFixture<ExportStepVisitsComponent>;
const group0Id = 'group0';
const group1Id = 'group1';
const node1Id = 'node1';
const node2Id = 'node2';
const node3Id = 'node3';
const allIds = [group0Id, group1Id, node1Id, node2Id, node3Id];

const group0 = createGroupNode(group0Id, [group1Id]);
const group1 = createGroupNode(group1Id, [node1Id, node2Id, node3Id]);
const node1 = createStepNode(node1Id);
const node2 = createStepNode(node2Id);
const node3 = createStepNode(node3Id);

describe('ExportStepVisitsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportStepVisitsComponent],
      imports: [ClassroomMonitorTestingModule, FormsModule, MatCheckboxModule, MatIconModule],
      providers: [DataExportService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportStepVisitsComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeOrderOfProject').and.returnValue({
      nodes: [{ node: group0 }, { node: group1 }, { node: node1 }, { node: node2 }, { node: node3 }]
    });
    fixture.detectChanges();
  });

  selectAll();
  deselectAll();
  nodeChecked();
});

function createGroupNode(id: string, ids: string[]) {
  return { id: id, type: 'group', ids: ids };
}

function createStepNode(id: string) {
  return { id: id, type: 'node' };
}

function selectAll() {
  describe('selectAll', () => {
    it('should select all', () => {
      setIdToCheckedForAll(component.idToChecked, false);
      component.selectAll();
      expectIdToCheckedForAll(component.idToChecked, true);
    });
  });
}

function setIdToCheckedForAll(idToChecked: any, value: boolean) {
  for (const id of allIds) {
    idToChecked[id] = value;
  }
}

function expectIdToCheckedForAll(idToChecked: any, value: boolean) {
  for (const id of allIds) {
    expect(idToChecked[id]).toEqual(value);
  }
}

function deselectAll() {
  describe('deselectAll', () => {
    it('should deselect all', () => {
      setIdToCheckedForAll(component.idToChecked, true);
      component.deselectAll();
      expectIdToCheckedForAll(component.idToChecked, false);
    });
  });
}

function nodeChecked() {
  describe('nodeChecked', () => {
    it('should check a group node', () => {
      setIdToCheckedForAll(component.idToChecked, false);
      component.idToChecked[group1Id] = true;
      component.nodeChecked(group1);
      expect(component.idToChecked[group0Id]).toEqual(false);
      expect(component.idToChecked[group1Id]).toEqual(true);
      expect(component.idToChecked[node1Id]).toEqual(true);
      expect(component.idToChecked[node2Id]).toEqual(true);
      expect(component.idToChecked[node3Id]).toEqual(true);
    });
    it('should check a step node', () => {
      setIdToCheckedForAll(component.idToChecked, false);
      component.idToChecked[node1Id] = true;
      component.nodeChecked(node1);
      expect(component.idToChecked[group0Id]).toEqual(false);
      expect(component.idToChecked[group1Id]).toEqual(false);
      expect(component.idToChecked[node1Id]).toEqual(true);
      expect(component.idToChecked[node2Id]).toEqual(false);
      expect(component.idToChecked[node3Id]).toEqual(false);
    });
  });
}
