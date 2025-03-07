import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputerAvatar } from '../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComputerAvatarSelectorComponent } from './computer-avatar-selector.component';
import { By } from '@angular/platform-browser';

const avatars: ComputerAvatar[] = [
  new ComputerAvatar('robot', 'Robot', 'robot.png'),
  new ComputerAvatar('monkey', 'Monkey', 'monkey.png')
];
let component: ComputerAvatarSelectorComponent;
let fixture: ComponentFixture<ComputerAvatarSelectorComponent>;
describe('ComputerAvatarSelectorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputerAvatarSelectorComponent],
      providers: [ComputerAvatarService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerAvatarSelectorComponent);
    spyOn(TestBed.inject(ComputerAvatarService), 'getAvatars').and.returnValue(avatars);
    component = fixture.componentInstance;
    component.computerAvatarSettings = {
      ids: ['robot', 'monkey'],
      label: 'Thought buddy',
      prompt: 'Discuss with your thought buddy',
      initialResponse: 'What do you think about...'
    };
    fixture.detectChanges();
  });

  ngOnInit();
  selectAvatar();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should show avatars and the continue button should be disabled', () => {
      expect(fixture.debugElement.queryAll(By.css('mat-button-toggle')).length).toEqual(2);
      expect(getContinueButton().nativeElement.disabled).toBeTrue();
    });
  });
}

function selectAvatar() {
  describe('select avatar', () => {
    beforeEach(() => {
      fixture.debugElement.queryAll(By.css('mat-button-toggle'))[0].nativeElement.click();
      fixture.detectChanges();
    });
    it('should enable the continue button', () => {
      expect(getContinueButton().nativeElement.disabled).toBeFalse();
    });

    clickContinueButton_shouldEmitAvatar();
  });
}

function clickContinueButton_shouldEmitAvatar() {
  describe('click on continue button', () => {
    it('should emit selected avatar', () => {
      const spy = spyOn(component.chooseAvatarEvent, 'emit');
      getContinueButton().nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(avatars[0]);
    });
  });
}

function getContinueButton() {
  return fixture.debugElement
    .queryAll(By.css('button'))
    .find((buttonDebugEl) => buttonDebugEl.nativeElement.textContent.includes('Continue'));
}
