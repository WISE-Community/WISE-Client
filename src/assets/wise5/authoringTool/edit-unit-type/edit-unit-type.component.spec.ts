import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUnitTypeComponent } from './edit-unit-type.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';

describe('EditUnitTypeComponent', () => {
  let component: EditUnitTypeComponent;
  let fixture: ComponentFixture<EditUnitTypeComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUnitTypeComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUnitTypeComponent);
    component = fixture.componentInstance;
    component.metadata = { unitType: 'Platform' };
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should show options and select unit type', async () => {
    const groups = await loader.getAllHarnesses(MatRadioGroupHarness);
    expect(groups.length).toBe(1);
    expect(await groups[0].getName()).toBe('unitTypes');
    const [firstRadio, secondRadio] = await loader.getAllHarnesses(MatRadioButtonHarness);
    expect(await firstRadio.getLabelText()).toContain('Platform');
    expect(await secondRadio.getLabelText()).toContain('Other Platform');
    expect(await firstRadio.isChecked()).toBeTrue();
  });

  it('should check radio button and trigger a save', async () => {
    const buttons = await loader.getAllHarnesses(MatRadioButtonHarness);
    const spy = spyOn(TestBed.inject(TeacherProjectService), 'saveProject').and.callFake(
      () => new Promise((resolve) => resolve(true))
    );
    await buttons[1].check();
    expect(await buttons[1].isChecked()).toBeTrue();
    expect(await buttons[0].isChecked()).toBeFalse();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
});
