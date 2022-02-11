import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { Observable, Subject } from 'rxjs';
import { EditComponentMaxSubmitComponent } from '../../../../../app/authoring-tool/edit-component-max-submit/edit-component-max-submit.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
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
  let allComputerAvatars: ComputerAvatar[];
  let component: DialogGuidanceAuthoringComponent;
  let fixture: ComponentFixture<DialogGuidanceAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DragDropModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      declarations: [
        DialogGuidanceAuthoringComponent,
        EditComponentPrompt,
        EditComponentMaxSubmitComponent,
        EditDialogGuidanceFeedbackRulesComponent
      ],
      providers: [
        ComputerAvatarService,
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
    allComputerAvatars = [
      new ComputerAvatar('robot', 'Robot', 'robot.png'),
      new ComputerAvatar('monkey', 'Monkey', 'Monkey.png'),
      new ComputerAvatar('girl', 'Girl', 'girl.png')
    ];
    spyOn(TestBed.inject(ComputerAvatarService), 'getAvatars').and.returnValue(allComputerAvatars);
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  it('should enable computer avatars for the first time', () => {
    expect(component.authoringComponentContent.computerAvatarIds).toBe(undefined);
    component.authoringComponentContent.isComputerAvatarEnabled = true;
    component.enableComputerAvatarClicked();
    expect(component.authoringComponentContent.computerAvatarIds).toEqual({
      girl: true,
      monkey: true,
      robot: true
    });
  });

  it('should enable computer avatars when they have previously been enabled', () => {
    const computerAvatarIds = {
      girl: true,
      robot: true
    };
    component.authoringComponentContent.computerAvatarIds = computerAvatarIds;
    component.authoringComponentContent.isComputerAvatarEnabled = true;
    component.enableComputerAvatarClicked();
    expect(component.authoringComponentContent.computerAvatarIds).toEqual(computerAvatarIds);
  });

  it('should select all computer avatars', () => {
    component.authoringComponentContent.computerAvatarIds = {};
    expect(isAllComputerAvatarsUnselected(component.allComputerAvatars)).toEqual(true);
    component.selectAllComputerAvatars();
    expect(isAllComputerAvatarsSelected(component.allComputerAvatars)).toEqual(true);
  });

  it('should unselect all computer avatars', () => {
    component.authoringComponentContent.computerAvatarIds = {
      girl: true,
      robot: true
    };
    component.unselectAllComputerAvatars();
    expect(isAllComputerAvatarsUnselected(component.allComputerAvatars)).toEqual(true);
  });

  it('should toggle selection of a computer avatar', () => {
    component.authoringComponentContent.computerAvatarIds = {};
    const computerAvatar: ComputerAvatar = component.allComputerAvatars[0];
    computerAvatar.isSelected = false;
    component.toggleSelectComputerAvatar(computerAvatar);
    expect(computerAvatar.isSelected).toEqual(true);
  });

  it('should save selected computer avatars', () => {
    component.authoringComponentContent.computerAvatarIds = {};
    component.allComputerAvatars[0].isSelected = true;
    component.allComputerAvatars[1].isSelected = false;
    component.allComputerAvatars[2].isSelected = true;
    component.saveSelectedComputerAvatars();
    expect(component.authoringComponentContent.computerAvatarIds).toEqual({
      girl: true,
      robot: true
    });
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

function isAllComputerAvatarsSelected(computerAvatars: ComputerAvatar[]): boolean {
  for (const computerAvatar of computerAvatars) {
    if (!computerAvatar.isSelected) {
      return false;
    }
  }
  return true;
}

function isAllComputerAvatarsUnselected(computerAvatars: ComputerAvatar[]): boolean {
  for (const computerAvatar of computerAvatars) {
    if (computerAvatar.isSelected) {
      return false;
    }
  }
  return true;
}
