import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLanguageChooserComponent } from './project-language-chooser.component';
import { ProjectLocale } from '../../domain/projectLocale';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('ProjectLanguageChooserComponent', () => {
  let component: ProjectLanguageChooserComponent;
  let fixture: ComponentFixture<ProjectLanguageChooserComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, ProjectLanguageChooserComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLanguageChooserComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.projectLocale = new ProjectLocale({ default: 'en_US', supported: ['ja', 'es'] });
    fixture.detectChanges();
  });

  it('shows available languages', async () => {
    const selects = await loader.getAllHarnesses(MatSelectHarness);
    const selectComponent = selects[0];
    await selectComponent.open();
    const options = await selectComponent.getOptions();
    expect(options.length).toEqual(3);
    expect(await options[0].getText()).toMatch('English');
    expect(await options[1].getText()).toMatch('Japanese');
    expect(await options[2].getText()).toMatch('Spanish');
  });
});
