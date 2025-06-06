import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitSurveyComponent } from './submit-survey.component';
import { ProjectService } from '../../services/projectService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { MockProvider, MockProviders } from 'ng-mocks';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ConfigService } from '../../../../app/services/config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { Config } from '../../../../app/domain/config';

let fixture: ComponentFixture<SubmitSurveyComponent>;
let loader: HarnessLoader;
let nodeStatusService: NodeStatusService;
let projectService: ProjectService;
describe('SubmitSurveyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSurveyComponent],
      providers: [
        MockProvider(ConfigService, {
          getConfig: () => of({ logOutURL: '/logout' } as Config)
        }),
        MockProviders(NodeStatusService, ProjectService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
    projectService = TestBed.inject(ProjectService);
    projectService.idToOrder = {
      node1: '0'
    };
    nodeStatusService = TestBed.inject(NodeStatusService);
    fixture = TestBed.createComponent(SubmitSurveyComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  submitSurvey_UnitIncomplete_ShowIncompleteSubmitWarning();
  submitSurvey_UnitComplete_ShowGenericSubmitWarning();
});

function submitSurvey_UnitIncomplete_ShowIncompleteSubmitWarning() {
  describe('Unit is incomplete', () => {
    beforeEach(() => {
      spyOn(projectService, 'isApplicationNode').and.returnValue(true);
      spyOn(nodeStatusService, 'getNodeStatusByNodeId').and.returnValue({
        isCompleted: false
      });
      spyOn(projectService, 'getNodePositionById').and.returnValue('1.1');
    });

    it('submitSurvey() should show incomplete message', async () => {
      spyOn(window, 'confirm');
      await (await loader.getHarness(MatButtonHarness)).click();
      expect(window.confirm).toHaveBeenCalledWith(
        'You have not completed the following steps:  1.1\n\nAre you sure you want to submit your final answers?\nIf you do, you will not be able to continue working on this unit.'
      );
    });
  });
}

function submitSurvey_UnitComplete_ShowGenericSubmitWarning() {
  describe('Unit is complete', () => {
    beforeEach(() => {
      spyOn(projectService, 'isApplicationNode').and.returnValue(true);
      spyOn(nodeStatusService, 'getNodeStatusByNodeId').and.returnValue({
        isCompleted: true
      });
    });

    it('submitSurvey() should show generic message', async () => {
      spyOn(window, 'confirm');
      await (await loader.getHarness(MatButtonHarness)).click();
      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to submit your final answers?\nIf you do, you will not be able to continue working on this unit.'
      );
    });
  });
}
