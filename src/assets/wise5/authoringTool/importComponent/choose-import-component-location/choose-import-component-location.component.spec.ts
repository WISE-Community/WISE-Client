import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChooseImportComponentLocationComponent } from './choose-import-component-location.component';
import { UpgradeModule } from '@angular/upgrade/static';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportComponentService } from '../../../services/importComponentService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertComponentService } from '../../../services/insertComponentService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

let component: ChooseImportComponentLocationComponent;
const componentId1 = 'component1';
const component1 = { id: componentId1, type: 'OpenResponse' };
const component2 = { id: 'component2', type: 'MultipleChoice' };
let fixture: ComponentFixture<ChooseImportComponentLocationComponent>;
let importComponentService: ImportComponentService;
const nodeId1 = 'node1';
const projectId1 = 1;

describe('ChooseImportComponentLocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseImportComponentLocationComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [
        ClassroomStatusService,
        CopyNodesService,
        ImportComponentService,
        InsertComponentService,
        ProjectAssetService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: () => {},
          importFromProjectId: projectId1,
          selectedComponents: [component2]
        };
      }
    };
    spyOn(TestBed.inject(TeacherDataService), 'saveEvent').and.callFake(() => {
      return Promise.resolve({});
    });
    spyOn(TestBed.inject(ProjectAssetService), 'retrieveProjectAssets').and.callFake(() => {});
    importComponentService = TestBed.inject(ImportComponentService);
    fixture = TestBed.createComponent(ChooseImportComponentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  importComponentAfter();
});

function importComponentAfter() {
  describe('importComponentAfter()', () => {
    it('should import component and add it after the selected component', fakeAsync(() => {
      const importComponentsSpy = spyOn(importComponentService, 'importComponents').and.returnValue(
        Promise.resolve([component1, component2])
      );
      component.nodeId = nodeId1;
      component.importComponentAfter(componentId1);
      expect(importComponentsSpy).toHaveBeenCalledWith(
        [component2],
        projectId1,
        nodeId1,
        componentId1
      );
    }));
  });
}
