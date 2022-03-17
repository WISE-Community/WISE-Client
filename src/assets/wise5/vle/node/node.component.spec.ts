import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentService } from '../../components/componentService';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { VLEProjectService } from '../vleProjectService';
import { NodeComponent } from './node.component';

let component: NodeComponent;
let createComponentStatesSpy: jasmine.Spy;
let fixture: ComponentFixture<NodeComponent>;

describe('NodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [NodeComponent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        NodeService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService,
        VLEProjectService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    spyOn(TestBed.inject(ConfigService), 'isRunActive').and.returnValue(true);
    spyOn(TestBed.inject(ConfigService), 'isEndedAndLocked').and.returnValue(false);
    spyOn(TestBed.inject(StudentDataService), 'getCurrentNode').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'getNodeStatusByNodeId').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent').and.callFake(() => {});
    spyOn(TestBed.inject(VLEProjectService), 'isApplicationNode').and.returnValue(true);
    spyOn(TestBed.inject(VLEProjectService), 'getNodeById').and.returnValue({ components: [] });
    spyOn(TestBed.inject(VLEProjectService), 'getNodeTitleByNodeId').and.returnValue('');
    component = fixture.componentInstance;
    fixture.detectChanges();
    createComponentStatesSpy = spyOn(component, 'createComponentStates');
  });

  afterEach(() => {
    createComponentStatesSpy.and.callFake(() => {
      return Promise.resolve([]);
    });
    fixture.destroy();
  });

  createAndSaveComponentData();
  getDataArraysToSaveFromComponentStates();
  getAnnotationsFromComponentStates();
});

function createAndSaveComponentData() {
  it('should create and save component data and call save to server with non null component states', async () => {
    const componentState1 = { id: 1 };
    const componentState2 = { id: 2 };
    const componentStates = [componentState1, componentState2];
    createComponentStatesSpy.and.callFake(() => {
      return Promise.resolve(componentStates);
    });
    const saveToServerSpy = spyOn(TestBed.inject(StudentDataService), 'saveToServer').and.callFake(
      () => {
        return Promise.resolve({});
      }
    );
    await component.createAndSaveComponentData(false);
    expect(saveToServerSpy).toHaveBeenCalledWith([componentState1, componentState2], [], []);
  });
}

function getDataArraysToSaveFromComponentStates() {
  it('should get data arrays to save from component states', () => {
    const annotation1 = { id: 100 };
    const annotation2 = { id: 200 };
    const annotation3 = { id: 300 };
    const componentState1 = { id: 1, annotations: [annotation1, annotation2] };
    const componentState2 = { id: 2, annotations: [annotation3] };
    const componentStatesFromComponents = [componentState1, componentState2];
    const {
      componentStates,
      componentEvents,
      componentAnnotations
    } = component.getDataArraysToSaveFromComponentStates(componentStatesFromComponents);
    expect(componentStates.length).toEqual(2);
    expect(componentStates[0]).toEqual(componentState1);
    expect(componentStates[1]).toEqual(componentState2);
    expect(componentStates[0].annotations).toBeUndefined();
    expect(componentStates[1].annotations).toBeUndefined();
    expect(componentEvents.length).toEqual(0);
    expect(componentAnnotations.length).toEqual(3);
    expect(componentAnnotations[0]).toEqual(annotation1);
    expect(componentAnnotations[1]).toEqual(annotation2);
    expect(componentAnnotations[2]).toEqual(annotation3);
  });
}

function getAnnotationsFromComponentStates() {
  it('should get annotations from component states', () => {
    const annotation1 = { id: 100 };
    const annotation2 = { id: 200 };
    const annotation3 = { id: 300 };
    const componentState1 = { id: 1, annotations: [annotation1, annotation2] };
    const componentState2 = { id: 2, annotations: [annotation3] };
    const componentStatesFromComponents = [componentState1, componentState2];
    const componentAnnotations = component.getAnnotationsFromComponentStates(
      componentStatesFromComponents
    );
    expect(componentAnnotations.length).toEqual(3);
    expect(componentAnnotations[0]).toEqual(annotation1);
    expect(componentAnnotations[1]).toEqual(annotation2);
    expect(componentAnnotations[2]).toEqual(annotation3);
  });
}
