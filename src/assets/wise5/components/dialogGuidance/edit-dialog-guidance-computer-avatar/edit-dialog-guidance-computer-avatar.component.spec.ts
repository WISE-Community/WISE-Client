import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { copy } from '../../../common/object/object';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditDialogGuidanceComputerAvatarComponent } from './edit-dialog-guidance-computer-avatar.component';

describe('EditDialogGuidanceComputerAvatarComponent', () => {
  let allComputerAvatars: ComputerAvatar[];
  let component: EditDialogGuidanceComputerAvatarComponent;
  let fixture: ComponentFixture<EditDialogGuidanceComputerAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditDialogGuidanceComputerAvatarComponent,
        MockComponent(TranslatableInputComponent)
      ],
      providers: [
        MockProviders(ComputerAvatarService, TeacherProjectService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDialogGuidanceComputerAvatarComponent);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    allComputerAvatars = [
      new ComputerAvatar('robot', 'Robot', 'robot.png'),
      new ComputerAvatar('monkey', 'Monkey', 'Monkey.png'),
      new ComputerAvatar('girl', 'Girl', 'girl.png')
    ];
    spyOn(TestBed.inject(ComputerAvatarService), 'getAvatars').and.returnValue(allComputerAvatars);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    component.computerAvatarSettings = {
      ids: [],
      label: 'Thought Buddy',
      prompt: 'Choose your thought buddy!',
      initialResponse: 'What do you think about...'
    };
    fixture.detectChanges();
  });

  it('should create with initial values', () => {
    component.computerAvatarSettings.ids = ['robot', 'monkey', 'girl'];
    component.ngOnInit();
    expect(component.allComputerAvatars).toEqual(allComputerAvatars);
    expect(isAllComputerAvatarsSelected(component.allComputerAvatars)).toBeTrue();
  });

  it('should select all computer avatars', () => {
    component.computerAvatarSettings.ids = ['robot'];
    component.ngOnInit();
    expect(isOnlyFirstComputerAvatarSelected(component.allComputerAvatars)).toEqual(true);
    component.selectAllComputerAvatars();
    expect(isAllComputerAvatarsSelected(component.allComputerAvatars)).toEqual(true);
  });

  it('should unselect all computer avatars', () => {
    component.computerAvatarSettings.ids = ['girl', 'robot'];
    component.unselectAllComputerAvatars();
    expect(isOnlyFirstComputerAvatarSelected(component.allComputerAvatars)).toEqual(true);
  });

  it('should toggle selection of a computer avatar', () => {
    component.computerAvatarSettings.ids = [];
    const computerAvatar: ComputerAvatar = component.allComputerAvatars[0];
    computerAvatar.isSelected = false;
    component.toggleSelectComputerAvatar(computerAvatar);
    expect(computerAvatar.isSelected).toEqual(true);
  });

  it('should save selected computer avatars', () => {
    component.computerAvatarSettings.ids = [];
    component.allComputerAvatars[0].isSelected = true;
    component.allComputerAvatars[1].isSelected = false;
    component.allComputerAvatars[2].isSelected = true;
    component.saveSelectedComputerAvatars();
    expect(component.computerAvatarSettings.ids).toEqual(['robot', 'girl']);
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

function isOnlyFirstComputerAvatarSelected(computerAvatars: ComputerAvatar[]): boolean {
  for (let c = 0; c < computerAvatars.length; c++) {
    const computerAvatar = computerAvatars[c];
    if (c === 0) {
      if (!computerAvatar.isSelected) {
        return false;
      }
    } else if (computerAvatar.isSelected) {
      return false;
    }
  }
  return true;
}
