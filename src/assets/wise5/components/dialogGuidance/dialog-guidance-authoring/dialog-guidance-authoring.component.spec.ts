import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { Observable, Subject } from 'rxjs';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { EditDialogGuidanceFeedbackRulesComponent } from '../edit-dialog-guidance-feedback-rules/edit-dialog-guidance-feedback-rules.component';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';

class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
  createNewComponentState() {
    return {};
  }
}

describe('DialogGuidanceAuthoringComponent', () => {
  let component: DialogGuidanceAuthoringComponent;
  let fixture: ComponentFixture<DialogGuidanceAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        UpgradeModule
      ],
      declarations: [
        DialogGuidanceAuthoringComponent,
        EditComponentPrompt,
        EditDialogGuidanceFeedbackRulesComponent
      ],
      providers: [
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceAuthoringComponent);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createComponentContent() {
  return {
    id: 'i64ex48j1z',
    type: 'DialogGuidance',
    prompt: '',
    feedbackRules: [],
    showSaveButton: false,
    showSubmitButton: false
  };
}
