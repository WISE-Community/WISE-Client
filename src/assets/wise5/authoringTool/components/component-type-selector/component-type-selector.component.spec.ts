import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../../../../app/services/user.service';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../../services/configService';
import { ComponentTypeSelectorComponent } from './component-type-selector.component';
import { ComponentTypeSelectorHarness } from './component-type-selector.harness';
import { MockProviders } from 'ng-mocks';
import { ComponentTypeService } from '../../../services/componentTypeService';

let component: ComponentTypeSelectorComponent;
let componentTypeSelectorHarness: ComponentTypeSelectorHarness;
let configService: ConfigService;
let fixture: ComponentFixture<ComponentTypeSelectorComponent>;
let userService: UserService;
describe('ComponentTypeSelectorComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ComponentTypeSelectorComponent, StudentTeacherCommonServicesModule],
      providers: [
        MockProviders(ComponentTypeService, ConfigService, UserService),
        provideHttpClient()
      ]
    });
    fixture = TestBed.createComponent(ComponentTypeSelectorComponent);
    const componentTypeService = TestBed.inject(ComponentTypeService);
    spyOn(componentTypeService, 'getComponentTypes').and.returnValue([
      { type: 'AiChat', name: 'AI Chat' },
      { type: 'Animation', name: 'Animation' },
      { type: 'AudioOscillator', name: 'Audio Oscillator' },
      { type: 'ConceptMap', name: 'Concept Map' },
      { type: 'DialogGuidance', name: 'Dialog Guidance' },
      { type: 'Discussion', name: 'Discussion' },
      { type: 'Draw', name: 'Draw' },
      { type: 'Embedded', name: 'Embedded' },
      { type: 'Graph', name: 'Graph' },
      { type: 'Label', name: 'Label' },
      { type: 'Match', name: 'Match' },
      { type: 'MultipleChoice', name: 'Multiple Choice' },
      { type: 'OpenResponse', name: 'Open Response' },
      { type: 'OutsideURL', name: 'Outside URL' },
      { type: 'PeerChat', name: 'Peer Chat' },
      { type: 'HTML', name: 'HTML' },
      { type: 'ShowGroupWork', name: 'Show Group Work' },
      { type: 'ShowMyWork', name: 'Show My Work' },
      { type: 'Summary', name: 'Summary' },
      { type: 'Table', name: 'Table' }
    ]);

    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getConfigParam').and.returnValue(true);
    userService = TestBed.inject(UserService);
    userService.isAuthenticated = true;
    spyOn(userService, 'getRoles').and.returnValue(['researcher', 'teacher']);
    component = fixture.componentInstance;
    component.componentType = 'OpenResponse';
    fixture.detectChanges();
    componentTypeSelectorHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ComponentTypeSelectorHarness
    );
  });
  goToPreviousComponent();
  goToNextComponent();
  selectComponent();
});

function goToPreviousComponent() {
  describe('click the previous button', () => {
    it('changes to the previous component type', async () => {
      expect(component.componentType).toEqual('OpenResponse');
      await (await componentTypeSelectorHarness.getPreviousComponentTypeButton()).click();
      expect(component.componentType).toEqual('MultipleChoice');
    });
  });
}

function goToNextComponent() {
  describe('click the next button', () => {
    it('changes to the next component type', async () => {
      expect(component.componentType).toEqual('OpenResponse');
      await (await componentTypeSelectorHarness.getNextComponentTypeButton()).click();
      expect(component.componentType).toEqual('OutsideURL');
    });
  });
}

function selectComponent() {
  describe('select first component type', () => {
    it('changes to the first component type and the previous button becomes disabled', async () => {
      await (
        await componentTypeSelectorHarness.getComponentTypeSelect()
      ).clickOptions({
        text: 'AI Chat'
      });
      expect(component.componentType).toEqual('AiChat');
      expect(
        await (await componentTypeSelectorHarness.getPreviousComponentTypeButton()).isDisabled()
      ).toBeTrue();
    });
  });
  describe('select last component type', () => {
    it('changes to the last component type and the next button becomes disabled', async () => {
      await (
        await componentTypeSelectorHarness.getComponentTypeSelect()
      ).clickOptions({
        text: 'Table'
      });
      expect(component.componentType).toEqual('Table');
      expect(
        await (await componentTypeSelectorHarness.getNextComponentTypeButton()).isDisabled()
      ).toBeTrue();
    });
  });
}
