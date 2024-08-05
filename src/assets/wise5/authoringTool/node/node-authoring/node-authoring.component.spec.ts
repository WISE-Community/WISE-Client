import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAuthoringComponent } from './node-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
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
import { DebugElement } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { EditNodeTitleComponent } from '../edit-node-title/edit-node-title.component';
import { AddComponentButtonComponent } from '../add-component-button/add-component-button.component';
import { CopyComponentButtonComponent } from '../copy-component-button/copy-component-button.component';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { ComponentTypeServiceModule } from '../../../services/componentTypeService.module';
import { DeleteTranslationsService } from '../../../services/deleteTranslationsService';
import { PreviewComponentButtonComponent } from '../../components/preview-component-button/preview-component-button.component';
import { TranslatableInputComponent } from '../../components/translatable-input/translatable-input.component';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';

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
      declarations: [CopyComponentButtonComponent, EditNodeTitleComponent, NodeAuthoringComponent],
      imports: [
        AddComponentButtonComponent,
        BrowserAnimationsModule,
        ComponentAuthoringModule,
        ComponentTypeServiceModule,
        DragDropModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        PreviewComponentButtonComponent,
        StudentTeacherCommonServicesModule,
        TeacherNodeIconComponent,
        TranslatableInputComponent
      ],
      providers: [
        ClassroomStatusService,
        CopyTranslationsService,
        DeleteTranslationsService,
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
        }
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
    component2 = { id: 'component2', type: 'MultipleChoice', showSubmitButton: true };
    component3 = { id: 'component3', type: 'Match', showSubmitButton: true };
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
    saveProjectSpy = spyOn(teacherProjectService, 'saveProject').and.returnValue(Promise.resolve());
    fixture = TestBed.createComponent(NodeAuthoringComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    component.components = node1Components;
    fixture.detectChanges();
  });

  copyComponent();
  deleteComponent();
  deleteComponents();
});

function copyComponent() {
  describe('copyComponent()', () => {
    it('should copy component', () => {
      clickComponentHeader(component2.id);
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
      clickComponentHeader(component2.id);
      fixture.detectChanges();
      expect(teacherProjectService.idToNode[nodeId1].components).toEqual(node1Components);
      confirmSpy.and.returnValue(true);
      clickComponentDeleteButton(component2.id);
      expect(confirmSpy).toHaveBeenCalledWith(
        `Are you sure you want to delete this component?\n2. MultipleChoice`
      );
      expect(saveProjectSpy).toHaveBeenCalled();
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
      expect(expectCheckboxValue(component1.id)).toBeFalsy();
      expect(expectCheckboxValue(component3.id)).toBeFalsy();
    });
  });
}

function expectCheckboxValue(componentId: string): void {
  return fixture.debugElement.query(By.css(`#${componentId} mat-checkbox`)).nativeElement.checked;
}

function clickComponentCheckbox(componentId: string): void {
  queryByCssAndClick(`#${componentId} mat-checkbox label`);
}

function clickComponentHeader(componentId: string): void {
  queryByCssAndClick(`#${componentId} .component-header`);
}

function queryByCssAndClick(css: string): void {
  clickNativeElement(fixture.debugElement.query(By.css(css)));
}

function clickComponentCopyButton(componentId: string): void {
  queryByCssAndClickCopy(`#${componentId} button`);
}

function clickCopyComponentsButton(): void {
  queryByCssAndClickCopy('button');
  fixture.detectChanges();
}

function queryByCssAndClickCopy(css: string): void {
  clickNativeElement(queryByCssAndInnerText(css, 'content_copy'));
}

function clickComponentDeleteButton(componentId: string): void {
  queryByCssAndClickDelete(`#${componentId} button`);
}

function clickDeleteComponentsButton(): void {
  queryByCssAndClickDelete('button');
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
