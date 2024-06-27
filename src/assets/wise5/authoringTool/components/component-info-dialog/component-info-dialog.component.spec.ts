import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInfoDialogComponent } from './component-info-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectService } from '../../../services/projectService';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentInfoDialogHarness } from './component-info-dialog.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MultipleChoiceInfo } from '../../../components/multipleChoice/MultipleChoiceInfo';
import { OutsideUrlInfo } from '../../../components/outsideURL/OutsideUrlInfo';
import { OpenResponseInfo } from '../../../components/openResponse/OpenResponseInfo';
import { ComponentInfo } from '../../../components/ComponentInfo';
import { ComponentTypeServiceModule } from '../../../services/componentTypeService.module';
import { ComponentStudentModule } from '../../../../../assets/wise5/components/component/component-student.module';

let component: ComponentInfoDialogComponent;
let fixture: ComponentFixture<ComponentInfoDialogComponent>;
let harness: ComponentInfoDialogHarness;
let multipleChoiceInfo = new MultipleChoiceInfo();
let openResponseInfo = new OpenResponseInfo();
let outsideUrlInfo = new OutsideUrlInfo();

describe('ComponentInfoDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ComponentInfoDialogComponent,
        ComponentStudentModule,
        ComponentTypeServiceModule,
        HttpClientTestingModule
      ],
      providers: [ComponentInfoService, { provide: MAT_DIALOG_DATA, useValue: 'OpenResponse' }]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentInfoDialogComponent);
    const projectService = TestBed.inject(ProjectService);
    projectService.project = {};
    component = fixture.componentInstance;
    window.MathJax = {
      startup: {
        promise: new Promise((resolve, reject) => {
          resolve({});
        })
      },
      typesetPromise: () => {}
    };
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ComponentInfoDialogHarness
    );
  });
  displayComponentWhenLoaded();
  goToPreviousComponent();
  goToNextComponent();
  selectComponent();
  selectComponentWithMultipleExamples();
});

function displayComponentWhenLoaded(): void {
  describe('initially loads with a component type', () => {
    it('displays the component', async () => {
      await expectComponentType(openResponseInfo);
    });
  });
}

function goToPreviousComponent(): void {
  describe('go to previous component', () => {
    it('displays the previous component', async () => {
      const componentTypeSelector = await harness.getComponentTypeSelector();
      (await componentTypeSelector.getPreviousComponentTypeButton()).click();
      await expectComponentType(multipleChoiceInfo);
    });
  });
}

function goToNextComponent(): void {
  describe('go to next component', () => {
    it('displays the next component', async () => {
      const componentTypeSelector = await harness.getComponentTypeSelector();
      (await componentTypeSelector.getNextComponentTypeButton()).click();
      await expectComponentType(outsideUrlInfo);
    });
  });
}

function selectComponent(): void {
  describe('select component', () => {
    it('displays the selected component', async () => {
      await selectComponentType('Multiple Choice');
      await expectComponentType(multipleChoiceInfo);
    });
  });
}

function selectComponentWithMultipleExamples(): void {
  describe('change to component type with multiple examples', () => {
    it('displays multiple examples', async () => {
      await selectComponentType('Multiple Choice');
      const tabGroup = await harness.getTabGroup();
      const expectedLabels = multipleChoiceInfo
        .getPreviewExamples()
        .map((example: any) => example.label);
      await expectTabLabels(await tabGroup.getTabs(), expectedLabels);
    });
  });
}

async function selectComponentType(componentType: string): Promise<void> {
  const componentTypeSelector = await harness.getComponentTypeSelector();
  const select = await componentTypeSelector.getComponentTypeSelect();
  await select.clickOptions({ text: componentType });
}

async function expectComponentType(componentInfo: ComponentInfo): Promise<void> {
  const componentTypeSelector = await harness.getComponentTypeSelector();
  const select = await componentTypeSelector.getComponentTypeSelect();
  expect(await select.getValueText()).toEqual(componentInfo.getLabel());
  const description = await harness.getDescription();
  expect(await description.text()).toEqual(componentInfo.getDescription());
}

async function expectTabLabels(tabs: any[], expectedLabels: string[]): Promise<void> {
  for (let i = 0; i < tabs.length; i++) {
    const tabLabel = await tabs[i].getLabel();
    expect(tabLabel).toEqual(expectedLabels[i]);
  }
}
