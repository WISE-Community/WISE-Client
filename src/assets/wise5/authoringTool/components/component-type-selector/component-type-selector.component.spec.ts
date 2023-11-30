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

let component: ComponentTypeSelectorComponent;
let componentTypeSelectorHarness: ComponentTypeSelectorHarness;
let fixture: ComponentFixture<ComponentTypeSelectorComponent>;

describe('ComponentTypeSelectorComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ComponentTypeSelectorComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      providers: []
    });
    fixture = TestBed.createComponent(ComponentTypeSelectorComponent);
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
        text: 'Animation'
      });
      expect(component.componentType).toEqual('Animation');
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
