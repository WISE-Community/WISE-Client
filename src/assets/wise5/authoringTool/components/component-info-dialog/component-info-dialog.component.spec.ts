import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInfoDialogComponent } from './component-info-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { PreviewComponentModule } from '../preview-component/preview-component.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PreviewComponentComponent } from '../preview-component/preview-component.component';
import { ProjectService } from '../../../services/projectService';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentTypeSelectorComponent } from '../component-type-selector/component-type-selector.component';
import { ComponentInfoDialogHarness } from './component-info-dialog.harness';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

let component: ComponentInfoDialogComponent;
let componentInfoDialogHarness: ComponentInfoDialogHarness;
let fixture: ComponentFixture<ComponentInfoDialogComponent>;

describe('ComponentInfoDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComponentInfoDialogComponent,
        ComponentTypeSelectorComponent,
        PreviewComponentComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        PreviewComponentModule
      ],
      providers: [ComponentInfoService, { provide: MAT_DIALOG_DATA, useValue: 'OpenResponse' }]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentInfoDialogComponent);
    const projectService = TestBed.inject(ProjectService);
    projectService.project = {};
    component = fixture.componentInstance;
    window.MathJax = {
      startup: {
        promise: new Promise((resolve, reject) => {
          resolve({});
        })
      },
      typesetPromise: () => {}
    };
    fixture.detectChanges();
    componentInfoDialogHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ComponentInfoDialogHarness
    );
  });
  displayComponent();
});

function displayComponent() {
  describe('display component', async () => {
    it('displays the component description', async () => {
      expect(await (await componentInfoDialogHarness.getDescription()).text()).toEqual(
        'Students type a response to a question or prompt.'
      );
    });
  });
}
