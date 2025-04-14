import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardsSelectMenuComponent } from './standards-select-menu.component';
import { Standard } from '../../library/standard';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

let component: StandardsSelectMenuComponent;
let fixture: ComponentFixture<StandardsSelectMenuComponent>;
describe('StandardSelectMenuComponent', () => {
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardsSelectMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StandardsSelectMenuComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.options = [
      new Standard('cc1', 'Common Core 3', 'Common Core', 'cc1.com'),
      new Standard('ngss1', 'NGSS 1', 'NGSS', 'ngss1.com'),
      new Standard('ngss2', 'NGSS 2', 'NGSS', 'ngss2,com')
    ];
    component.possibleLabels = ['NGSS', 'Common Core', 'Learning For Justice'];
    fixture.detectChanges();
  });

  it('should show groups and options', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const optionGroups = await select.getOptionGroups();
    expect(optionGroups.length).toBe(2);
    expect(await optionGroups[0].getLabelText()).toBe('NGSS');
    expect(await optionGroups[1].getLabelText()).toBe('Common Core');
    const options = await select.getOptions();
    expect(options.length).toBe(3);
  });
});
