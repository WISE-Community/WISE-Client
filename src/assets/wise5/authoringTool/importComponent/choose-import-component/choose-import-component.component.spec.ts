import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChooseImportComponentComponent } from './choose-import-component.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from '../../../services/configService';
import { ProjectLibraryService } from '../../../services/projectLibraryService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ImportComponentService } from '../../../services/importComponentService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertComponentService } from '../../../services/insertComponentService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: ChooseImportComponentComponent;
const component1 = { id: 'component1', type: 'OpenResponse' };
const component2 = { id: 'component2', type: 'MultipleChoice' };
let fixture: ComponentFixture<ChooseImportComponentComponent>;
const group0 = { id: 'group0', type: 'group', ids: ['group1'] };
const group1 = { id: 'group1', type: 'group', title: '', startId: 'node1', ids: ['node1'] };
const node1 = {
  id: 'node1',
  type: 'node',
  title: '',
  components: [component1, component2]
};
const project: any = {
  startGroupId: 'group0',
  nodes: [group0, group1, node1],
  inactiveNodes: []
};
let projectService: TeacherProjectService;

describe('ChooseImportComponentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChooseImportComponentComponent],
    imports: [BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [
        ClassroomStatusService,
        ConfigService,
        CopyNodesService,
        ImportComponentService,
        InsertComponentService,
        ProjectAssetService,
        ProjectLibraryService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    projectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(ChooseImportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  showMyImportProject();
  showLibraryImportProject();
  importComponents();
});

function showMyImportProject() {
  describe('showMyImportProject()', () => {
    it('should set my import project', fakeAsync(() => {
      spyOn(projectService, 'retrieveProjectById').and.returnValue(Promise.resolve(project));
      component.importLibraryProjectId = 1;
      component.showMyImportProject(2);
      expect(component.importLibraryProjectId).toBeNull();
      tick();
      expectNodesInOrder();
      expectImportProjectItems();
    }));
  });
}

function showLibraryImportProject() {
  describe('showLibraryImportProject()', () => {
    it('should set library import project', fakeAsync(() => {
      spyOn(projectService, 'retrieveProjectById').and.returnValue(Promise.resolve(project));
      component.importMyProjectId = 1;
      component.showLibraryImportProject(2);
      expect(component.importMyProjectId).toBeNull();
      tick();
      expectNodesInOrder();
      expectImportProjectItems();
    }));
  });
}

function expectNodesInOrder() {
  expect(component.nodesInOrder).toEqual([
    { order: 0, node: group0, stepNumber: '' },
    { order: 1, node: group1, stepNumber: '1' },
    { order: 2, node: node1, stepNumber: '1.1' }
  ]);
}

function expectImportProjectItems() {
  expect(component.importProjectItems).toEqual([{ order: 2, node: node1, stepNumber: '1.1' }]);
}

function importComponents() {
  describe('importComponents()', () => {
    it('when no components are selected, should alert message', () => {
      const alertSpy = spyOn(window, 'alert');
      component.importComponents();
      expect(alertSpy).toHaveBeenCalledWith('Please select a component to import.');
    });

    xit('when a component is selected, should import component', () => {
      const importProjectId = 1;
      const spy = spyOn(TestBed.inject(ImportComponentService), 'importComponents').and.stub();
      component.importProjectId = importProjectId;
      const node = JSON.parse(JSON.stringify(node1));
      node.components[0].checked = true;
      component.importProjectItems = [{ order: 2, node: node, stepNumber: '1.1' }];
      component.importComponents();
      expect(spy).toHaveBeenCalled();
    });
  });
}
