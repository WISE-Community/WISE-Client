import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { LocationSelectMenuComponent } from './location-select-menu.component';
import { Location } from '../../library/Location';

let component: LocationSelectMenuComponent;
let fixture: ComponentFixture<LocationSelectMenuComponent>;
describe('LocationSelectMenuComponent', () => {
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSelectMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectMenuComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component['viewValueProp'] = 'name';
    component.options = [
      Object.assign(new Location(), {
        level1: 'USA',
        level2: 'California'
      }),
      Object.assign(new Location(), {
        level1: 'USA',
        level2: 'New York'
      }),
      Object.assign(new Location(), {
        level1: 'Canada',
        level2: 'Ontario'
      })
    ];
    fixture.detectChanges();
  });

  it('should show groups and options', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const optionGroups = await select.getOptionGroups();
    expect(
      await Promise.all(optionGroups.map(async (option) => await option.getLabelText()))
    ).toEqual(['State', 'Country']);
    const options = await select.getOptions();
    expect(await Promise.all(options.map(async (option) => await option.getText()))).toEqual([
      'California, USA',
      'New York, USA',
      'Ontario, Canada',
      'Canada',
      'USA'
    ]);
  });
});
