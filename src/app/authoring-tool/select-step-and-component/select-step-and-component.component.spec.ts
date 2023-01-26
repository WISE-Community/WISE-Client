import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ReferenceComponent } from '../../domain/referenceComponent';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { SelectStepAndComponentComponent } from './select-step-and-component.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

let component: SelectStepAndComponentComponent;
const componentId1 = 'component1';
const componentId2 = 'component2';
const componentId3 = 'component3';
let fixture: ComponentFixture<SelectStepAndComponentComponent>;
let loader: HarnessLoader;
const nodeId1 = 'node1';
const nodeId2 = 'node2';

describe('SelectStepAndComponentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [SelectStepAndComponentComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(SelectStepAndComponentComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.referenceComponent = new ReferenceComponent(null, null);
    component.allowedComponentTypes = ['OpenResponse'];
    spyOn(TestBed.inject(ProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1,
      nodeId2
    ]);
    fixture.detectChanges();
  });
  selectComponent();
  stepChanged();
});

function selectComponent() {
  it('should disable certain options in the select component', async () => {
    setUpGetComponentsSpy([
      createComponent(componentId1, 'OpenResponse'),
      createComponent(componentId2, 'Graph'),
      createComponent(componentId3, 'OpenResponse')
    ]);
    component.thisComponentId = componentId1;
    const selects = await loader.getAllHarnesses(MatSelectHarness);
    const selectComponent = selects[1];
    await selectComponent.open();
    const options = await selectComponent.getOptions();
    expect(await options[0].isDisabled()).toBeTrue();
    expect(await options[1].isDisabled()).toBeTrue();
    expect(await options[2].isDisabled()).toBeFalse();
  });
}

function stepChanged() {
  describe('stepChanged()', () => {
    it('should handle step changed when there are no allowed components', () => {
      setUpGetComponentsSpy([
        createComponent(componentId1, 'Draw'),
        createComponent(componentId2, 'Graph'),
        createComponent(componentId3, 'Table')
      ]);
      component.referenceComponent.nodeId = nodeId1;
      component.stepChanged(nodeId1);
      expect(component.referenceComponent.nodeId).toEqual(nodeId1);
      expect(component.referenceComponent.componentId).toEqual(null);
    });

    it('should handle step changed when there is one allowed component', () => {
      setUpGetComponentsSpy([
        createComponent(componentId1, 'Draw'),
        createComponent(componentId2, 'OpenResponse'),
        createComponent(componentId3, 'Table')
      ]);
      component.referenceComponent.nodeId = nodeId1;
      component.stepChanged(nodeId1);
      expect(component.referenceComponent.nodeId).toEqual(nodeId1);
      expect(component.referenceComponent.componentId).toEqual(componentId2);
    });

    it('should handle step changed when there are multiple allowed components', () => {
      setUpGetComponentsSpy([
        createComponent(componentId1, 'Draw'),
        createComponent(componentId2, 'OpenResponse'),
        createComponent(componentId3, 'OpenResponse')
      ]);
      component.referenceComponent.nodeId = nodeId1;
      component.stepChanged(nodeId1);
      expect(component.referenceComponent.nodeId).toEqual(nodeId1);
      expect(component.referenceComponent.componentId).toEqual(null);
    });
  });
}

function setUpGetComponentsSpy(components: any[]): void {
  spyOn(TestBed.inject(ProjectService), 'getComponents').and.returnValue(components);
}

function createComponent(id: string, type: string): any {
  return { id: id, type: type };
}
