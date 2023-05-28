import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAuthoringComponent } from './node-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CopyComponentService } from '../../../services/copyComponentService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialogModule } from '@angular/material/dialog';
import { InsertComponentService } from '../../../services/insertComponentService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TeacherNodeIconComponent } from '../../teacher-node-icon/teacher-node-icon.component';
import { ComponentAuthoringModule } from '../../../../../app/teacher/component-authoring.module';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { PreviewComponentModule } from '../../components/preview-component/preview-component.module';

let component: NodeAuthoringComponent;
let component1: any;
let component2: any;
let component3: any;
let confirmSpy: jasmine.Spy;
let fixture: ComponentFixture<NodeAuthoringComponent>;
let node1Components = [];
const nodeId1 = 'node1';
let teacherDataService: TeacherDataService;
let teacherProjectService: TeacherProjectService;

describe('NodeAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeAuthoringComponent, TeacherNodeIconComponent],
      imports: [
        BrowserAnimationsModule,
        ComponentAuthoringModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        PreviewComponentModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [
        ClassroomStatusService,
        CopyComponentService,
        ProjectAssetService,
        InsertComponentService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          current: {
            name: 'root.at.project.node'
          },
          go: (route: string, params: any) => {},
          newComponents: [],
          nodeId: nodeId1
        };
      }
    };
    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
    confirmSpy = spyOn(window, 'confirm');
    component1 = { id: 'component1', type: 'OpenResponse', showSubmitButton: true };
    component2 = { id: 'component2', type: 'MultipleChoice', showSubmitButton: true };
    component3 = { id: 'component3', type: 'Match', showSubmitButton: true };
    node1Components = [component1, component2, component3];
    teacherProjectService = TestBed.inject(TeacherProjectService);
    teacherProjectService.idToNode = {
      node1: {
        components: node1Components
      }
    };
    teacherDataService = TestBed.inject(TeacherDataService);
    spyOn(teacherDataService, 'saveEvent').and.callFake(() => {
      return Promise.resolve();
    });
    fixture = TestBed.createComponent(NodeAuthoringComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    component.components = node1Components;
    fixture.detectChanges();
  });

  deleteComponent();
  deleteComponents();
});

function deleteComponent() {
  describe('deleteComponent()', () => {
    it('should delete component', () => {
      clickComponentHeader(component2.id);
      fixture.detectChanges();
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual(node1Components);
      confirmSpy.and.returnValue(true);
      clickComponentDeleteButton(component2.id);
      expect(confirmSpy).toHaveBeenCalledWith(
        `Are you sure you want to delete this component?\n2. MultipleChoice`
      );
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual([component1, component3]);
    });
  });
}

function deleteComponents() {
  describe('deleteComponents()', () => {
    it('should delete components', () => {
      clickComponentCheckbox(component1.id);
      clickComponentCheckbox(component3.id);
      fixture.detectChanges();
      expect(component.components).toEqual(node1Components);
      confirmSpy.and.returnValue(true);
      clickDeleteComponentsButton();
      expect(confirmSpy).toHaveBeenCalledWith(
        `Are you sure you want to delete these components?\n1. OpenResponse\n3. Match`
      );
      expect(component.components).toEqual([component2]);
      expect(component.componentsToChecked[component1.id]).toBeUndefined();
      expect(component.componentsToChecked[component3.id]).toBeUndefined();
    });
  });
}

function clickComponentHeader(componentId: string): void {
  queryByCssAndClick(`#${componentId} .component-header`);
}

function clickComponentDeleteButton(componentId: string): void {
  queryAllByCssAndClickDelete(`#${componentId} button`);
}

function clickComponentCheckbox(componentId: string): void {
  queryByCssAndClick(`#${componentId} mat-checkbox label`);
}

function clickDeleteComponentsButton(): void {
  queryAllByCssAndClickDelete('button');
}

function queryByCssAndClick(css: string): void {
  fixture.debugElement.query(By.css(css)).nativeElement.click();
}

function queryAllByCssAndClickDelete(css: string): void {
  fixture.debugElement
    .queryAll(By.css(css))
    .find((button) => button.nativeElement.innerText === 'delete')
    .nativeElement.click();
}
