import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLanguageChooserComponent } from './project-language-chooser.component';
import { ProjectLocale } from '../../domain/projectLocale';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';
import { ProjectService } from '../../../assets/wise5/services/projectService';

class MockProjectService {
  currentLanguage() {
    return null;
  }
}

let loader: HarnessLoader;
let component: ProjectLanguageChooserComponent;
let fixture: ComponentFixture<ProjectLanguageChooserComponent>;
describe('ProjectLanguageChooserComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, ProjectLanguageChooserComponent],
      providers: [{ provide: ProjectService, useClass: MockProjectService }]
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
    const selected = await options[0].host();
    expect(await selected.getAttribute('class')).toContain('primary');
  });

  it('keeps selected language option when language option changes', async () => {
    const menuHarness = await loader.getHarness(MatMenuHarness);
    await menuHarness.clickItem({ text: 'Japanese' });
    spyOn(TestBed.inject(ProjectService), 'currentLanguage').and.returnValue({
      locale: 'ja',
      language: 'Japanese'
    });
    setProjectLocale(new ProjectLocale({ default: 'it', supported: ['de', 'fr', 'ja', 'es'] }));
    const options = await getOptions();
    const selected = await options[3].host();
    expect(await selected.getAttribute('class')).toContain('primary');
  });
});

function setProjectLocale(locale: ProjectLocale): void {
  component.projectLocale = locale;
  component.ngOnChanges();
  fixture.detectChanges();
}

async function getOptions(): Promise<MatMenuItemHarness[]> {
  const menuHarness = await loader.getHarness(MatMenuHarness);
  await menuHarness.open();
  return await menuHarness.getItems();
}
