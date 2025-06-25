import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicUnitTypeSelectorComponent } from './public-unit-type-selector.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatDialog } from '@angular/material/dialog';

describe('PublicUnitTypeSelectorComponent', () => {
  let component: PublicUnitTypeSelectorComponent;
  let fixture: ComponentFixture<PublicUnitTypeSelectorComponent>;
  let loader: HarnessLoader;
  let checkbox1, checkbox2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicUnitTypeSelectorComponent],
      providers: [ProjectFilterValues]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicUnitTypeSelectorComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
    [checkbox1, checkbox2] = await loader.getAllHarnesses(MatCheckboxHarness);
  });

  it('should create and not select checkbox by default', async () => {
    expect(component).toBeTruthy();
    expect(await checkbox1.isChecked()).toBe(false);
    expect(await checkbox2.isChecked()).toBe(false);
  });

  it('should update filterValues and emit event when checkbox is clicked', async () => {
    const spy = spyOn(component.publicUnitTypeUpdatedEvent, 'emit');
    await checkbox1.check();
    expect(TestBed.inject(ProjectFilterValues).publicUnitTypeValue).toEqual(['wiseTested']);
    expect(spy).toHaveBeenCalled();
  });

  it('should show details when info is clicked', () => {
    const spy = spyOn(TestBed.inject(MatDialog), 'open');
    fixture.debugElement.nativeElement.querySelector('a').click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
