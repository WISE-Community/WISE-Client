import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentTypeSelectorComponent } from './component-type-selector.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentTypeSelectorHarness } from './component-type-selector.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentTypeServiceModule } from '../../../services/componentTypeService.module';
import { UserService } from '../../../../../app/services/user.service';
import { ConfigService } from '../../../services/configService';

let component: ComponentTypeSelectorComponent;
let componentTypeSelectorHarness: ComponentTypeSelectorHarness;
let configService: ConfigService;
let fixture: ComponentFixture<ComponentTypeSelectorComponent>;
let userService: UserService;

describe('ComponentTypeSelectorComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ComponentTypeSelectorComponent],
      imports: [
        BrowserAnimationsModule,
        ComponentTypeServiceModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      providers: []
    });
    fixture = TestBed.createComponent(ComponentTypeSelectorComponent);
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
      await (await componentTypeSelectorHarness.getComponentTypeSelect()).clickOptions({
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
      await (await componentTypeSelectorHarness.getComponentTypeSelect()).clickOptions({
        text: 'Table'
      });
      expect(component.componentType).toEqual('Table');
      expect(
        await (await componentTypeSelectorHarness.getNextComponentTypeButton()).isDisabled()
      ).toBeTrue();
    });
  });
}
