import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAuthoringComponent } from './node-authoring.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { DebugElement } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { DeleteTranslationsService } from '../../../services/deleteTranslationsService';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CreateComponentService } from '../../../services/createComponentService';
import { VLEProjectService } from '../../../vle/vleProjectService';
import { NotebookService } from '../../../services/notebookService';
import { MockProviders } from 'ng-mocks';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

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
let saveProjectSpy: jasmine.Spy;

describe('NodeAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeAuthoringComponent, StudentTeacherCommonServicesModule],
      providers: [
        MockProviders(ComponentTypeService, DeleteTranslationsService),
        ClassroomStatusService,
        CreateComponentService,
        CopyTranslationsService,
        TeacherProjectTranslationService,
        ProjectAssetService,
        TeacherDataService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherWebSocketService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ nodeId: 'node1' }) },
            parent: { params: of({ unitId: 1 }) }
          }
        },
        {
          provide: Router,
          useValue: {
            events: of([]),
            url: '/teacher/edit/unit/123/node/node4'
          }
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
    window.history.pushState(
      {
        newComponents: []
      },
      '',
      ''
    );
    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
    confirmSpy = spyOn(window, 'confirm');
    component1 = { id: 'component1', type: 'OpenResponse', showSubmitButton: true };
    component2 = { id: 'component2', type: 'MultipleChoice', showSubmitButton: true, choices: [] };
    component3 = { id: 'component3', type: 'HTML', showSubmitButton: true, html: '' };
    node1Components = [component1, component2, component3];
    teacherProjectService = TestBed.inject(TeacherProjectService);
    const node1 = { components: node1Components };
    teacherProjectService.idToNode = { node1: node1 };
    teacherProjectService.project = {
      nodes: [{ id: nodeId1, components: node1Components }],
      inactiveNodes: [],
      metadata: { locale: { default: 'en_US', supported: ['es'] } }
    };
    spyOn(teacherProjectService, 'getNodeById').and.returnValue(node1);
    teacherDataService = TestBed.inject(TeacherDataService);
    spyOn(teacherDataService, 'saveEvent').and.callFake(() => {
      return Promise.resolve();
    });
    spyOn(teacherProjectService, 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US', supported: ['es'] })
    );
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    const vleProjectService = TestBed.inject(VLEProjectService);
    vleProjectService.project = teacherProjectService.project;
    spyOn(TestBed.inject(VLEProjectService), 'getSpeechToTextSettings').and.returnValue(null);
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(false);
    saveProjectSpy = spyOn(teacherProjectService, 'saveProject').and.returnValue(Promise.resolve());
    fixture = TestBed.createComponent(NodeAuthoringComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    component.components = node1Components;
    fixture.detectChanges();
  });

  copyComponent();
  deleteComponent();
});

function copyComponent() {
  describe('copyComponent()', () => {
    it('should copy component', () => {
      clickComponent(component2.id);
      fixture.detectChanges();
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual(node1Components);
      clickComponentCopyButton(component2.id);
      const components = teacherProjectService.idToNode[nodeId1].components;
      expect(components.length).toEqual(4);
      expect(components[0].id).toEqual(component1.id);
      expect(components[1].id).toEqual(component2.id);
      expect(components[2].id).not.toEqual(component2.id);
      expect(components[3].id).toEqual(component3.id);
    });
  });
}

function deleteComponent() {
  describe('deleteComponent()', () => {
    it('should delete component', () => {
      clickComponent(component2.id);
      fixture.detectChanges();
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual(node1Components);
      confirmSpy.and.returnValue(true);
      clickComponentDeleteButton(component2.id);
      expect(confirmSpy).toHaveBeenCalledWith(
        `Are you sure you want to delete this activity?\n\n2. MultipleChoice`
      );
      expect(saveProjectSpy).toHaveBeenCalled();
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual([component1, component3]);
    });
  });
}

function clickComponent(componentId: string): void {
  queryByCssAndClick(`#${componentId}`);
}

function queryByCssAndClick(css: string): void {
  clickNativeElement(fixture.debugElement.query(By.css(css)));
}

function clickComponentCopyButton(componentId: string): void {
  queryByCssAndClickCopy(`#${componentId} button`);
}

function queryByCssAndClickCopy(css: string): void {
  clickNativeElement(queryByCssAndInnerText(css, 'content_copy'));
}

function clickComponentDeleteButton(componentId: string): void {
  queryByCssAndClickDelete(`#${componentId} button`);
}

function queryByCssAndClickDelete(css: string): void {
  clickNativeElement(queryByCssAndInnerText(css, 'delete'));
}

function queryByCssAndInnerText(css: string, innerText: string): DebugElement {
  return fixture.debugElement
    .queryAll(By.css(css))
    .find((element) => element.nativeElement.innerText === innerText);
}

function clickNativeElement(element: DebugElement): void {
  element.nativeElement.click();
}
