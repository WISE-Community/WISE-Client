import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { ReferenceComponent } from '../../domain/referenceComponent';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { SelectStepAndComponentComponent } from './select-step-and-component.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { SelectStepAndComponentHarness } from './select-step-and-component.harness';
import { SelectStepComponent } from '../select-step/select-step.component';

let component: SelectStepAndComponentComponent;
const componentId1 = 'component1';
const componentId2 = 'component2';
const componentId3 = 'component3';
let fixture: ComponentFixture<SelectStepAndComponentComponent>;
let harness: SelectStepAndComponentHarness;
let loader: HarnessLoader;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const nodeIds = [nodeId1, nodeId2];
const nodeTitle1 = '1.1: First Step';
const nodeTitle2 = '1.2: Second Step';
let projectService: ProjectService;

describe('SelectStepAndComponentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SelectStepAndComponentComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [ProjectService]
    }).compileComponents();
    fixture = TestBed.createComponent(SelectStepAndComponentComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.referenceComponent = new ReferenceComponent(null, null);
    component.allowedComponentTypes = ['OpenResponse'];
    projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getStepNodeIds').and.returnValue(nodeIds);
    spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue(nodeIds);
    spyOn(projectService, 'getNodePositionAndTitle').and.callFake((nodeId: string) => {
      switch (nodeId) {
        case nodeId1:
          return nodeTitle1;
        case nodeId2:
          return nodeTitle2;
      }
    });
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      SelectStepAndComponentHarness
    );
  });
  selectComponent();
  stepChanged();
});

function selectComponent() {
  it('should disable certain options in the select component', async () => {
    setUpThreeComponentsSpy('OpenResponse', 'Graph', 'OpenResponse');
    component.referenceComponent.nodeId = nodeId1;
    component.thisComponentId = componentId1;
    component.ngOnInit();
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
    it('should handle step changed when there are no allowed components', async () => {
      await setComponentsAndCallStepChanged('Draw', 'Graph', 'Table');
      expectReferenceComponentValues(nodeId1, null);
    });

    it('should handle step changed when there is one allowed component', async () => {
      await setComponentsAndCallStepChanged('Draw', 'OpenResponse', 'Table');
      expectReferenceComponentValues(nodeId1, componentId2);
    });

    it('should handle step changed when there are multiple allowed components', async () => {
      await setComponentsAndCallStepChanged('Draw', 'OpenResponse', 'OpenResponse');
      expectReferenceComponentValues(nodeId1, null);
    });
  });
}

function setUpThreeComponentsSpy(
  componentType1: string,
  componentType2: string,
  componentType3: string
): void {
  setUpGetComponentsSpy([
    createComponent(componentId1, componentType1),
    createComponent(componentId2, componentType2),
    createComponent(componentId3, componentType3)
  ]);
}

function createComponent(id: string, type: string): any {
  return { id: id, type: type };
}

function setUpGetComponentsSpy(components: any[]): void {
  spyOn(TestBed.inject(ProjectService), 'getComponents').and.returnValue(components);
}

async function setComponentsAndCallStepChanged(
  componentType1: string,
  componentType2: string,
  componentType3: string
): Promise<void> {
  setUpThreeComponentsSpy(componentType1, componentType2, componentType3);
  const selectStepHarness = await harness.getSelectStep();
  const select = await selectStepHarness.getSelect();
  await select.open();
  await select.clickOptions({ text: nodeTitle1 });
}

function expectReferenceComponentValues(nodeId: string, componentId: string): void {
  expect(component.referenceComponent.nodeId).toEqual(nodeId);
  expect(component.referenceComponent.componentId).toEqual(componentId);
}
