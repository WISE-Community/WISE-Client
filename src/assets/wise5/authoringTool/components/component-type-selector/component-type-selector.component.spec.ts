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
    spyOn(componentTypeService, 'getComponentGroups').and.returnValue([
      {
        name: 'View Information',
        types: [
          {
            type: 'HTML',
            name: 'Display Content',
            icon: 'newspaper'
          },
          {
            type: 'ShowMyWork',
            name: 'Show Student Work',
            icon: 'assignment'
          },
          {
            type: 'Summary',
            name: 'Summary Graph',
            icon: 'pie_chart'
          }
        ]
      },
      {
        name: 'Explain and Assess',
        types: [
          {
            type: 'ConceptMap',
            name: 'Concept Map',
            icon: 'account_tree'
          },
          {
            type: 'Draw',
            name: 'Draw',
            icon: 'draw'
          },
          {
            type: 'Label',
            name: 'Label',
            icon: 'sticky_note_2'
          },
          {
            type: 'MultipleChoice',
            name: 'Multiple Choice',
            icon: 'ballot'
          },
          {
            type: 'OpenResponse',
            name: 'Open Response',
            icon: 'edit_note'
          },
          {
            type: 'Match',
            name: 'Sort',
            icon: 'category'
          }
        ]
      },
      {
        name: 'Experiment, Discover, Distinguish',
        types: [
          {
            type: 'AiChat',
            name: 'AI Chat',
            icon: 'assistant'
          },
          {
            type: 'Animation',
            name: 'Animation',
            icon: 'animation'
          },
          {
            type: 'AudioOscillator',
            name: 'Audio Oscillator',
            icon: 'waves'
          },
          {
            type: 'Embedded',
            name: 'Custom',
            icon: 'handyman'
          },
          {
            type: 'Graph',
            name: 'Graph',
            icon: 'bar_chart'
          },
          {
            type: 'OutsideURL',
            name: 'Outside Resource',
            icon: 'web'
          },
          {
            type: 'Table',
            name: 'Table',
            icon: 'table_chart'
          }
        ]
      },
      {
        name: 'Collaborate',
        types: [
          {
            type: 'DialogGuidance',
            name: 'Dialog',
            icon: 'chat'
          },
          {
            type: 'Discussion',
            name: 'Discussion',
            icon: 'forum'
          },
          {
            type: 'PeerChat',
            name: 'Peer Chat',
            icon: 'people'
          },
          {
            type: 'ShowGroupWork',
            name: 'Show Group Work',
            icon: 'co_present'
          }
        ]
      }
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
      expect(component.componentType).toEqual('Match');
    });
  });
}

function selectComponent() {
  describe('select first component type', () => {
    it('changes to the first component type and the previous button becomes disabled', async () => {
      await (
        await componentTypeSelectorHarness.getComponentTypeSelect()
      ).clickOptions({
        text: 'Display Content'
      });
      expect(component.componentType).toEqual('HTML');
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
        text: 'Show Group Work'
      });
      expect(component.componentType).toEqual('ShowGroupWork');
      expect(
        await (await componentTypeSelectorHarness.getNextComponentTypeButton()).isDisabled()
      ).toBeTrue();
    });
  });
}
