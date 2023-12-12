import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLanguageChooserComponent } from './project-language-chooser.component';
import { ProjectLocale } from '../../domain/projectLocale';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatOptionHarness } from '@angular/material/core/testing';

let loader: HarnessLoader;
let component: ProjectLanguageChooserComponent;
let fixture: ComponentFixture<ProjectLanguageChooserComponent>;
describe('ProjectLanguageChooserComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, ProjectLanguageChooserComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLanguageChooserComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    setProjectLocale(new ProjectLocale({ default: 'en_US', supported: ['ja', 'es'] }));
  });

  it('shows available languages and selects the default language', async () => {
    const options = await getOptions();
    expect(options.length).toEqual(3);
    expect(await options[0].getText()).toMatch('English');
    expect(await options[1].getText()).toMatch('Japanese');
    expect(await options[2].getText()).toMatch('Spanish');
    expect(await options[0].isSelected()).toBeTrue();
  });

  it('keeps selected language option when language option changes', async () => {
    const selectHarness = await loader.getHarness(MatSelectHarness);
    await selectHarness.clickOptions({ text: 'Japanese' });
    setProjectLocale(new ProjectLocale({ default: 'it', supported: ['de', 'fr', 'ja', 'es'] }));
    expect(await selectHarness.getValueText()).toEqual('Japanese');
  });
});

function setProjectLocale(locale: ProjectLocale): void {
  component.projectLocale = locale;
  component.ngOnChanges();
  fixture.detectChanges();
}

async function getOptions(): Promise<MatOptionHarness[]> {
  const selectHarness = await loader.getHarness(MatSelectHarness);
  await selectHarness.open();
  return await selectHarness.getOptions();
}
