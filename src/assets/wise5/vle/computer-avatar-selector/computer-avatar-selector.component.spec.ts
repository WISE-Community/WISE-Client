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
  onlyOneAvatar();
});

function onlyOneAvatar() {
  describe('only one avatar', () => {
    beforeEach(() => {
      component.computerAvatarSettings.ids = ['robot'];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should automatically select the avatar and only show the continue button', () => {
      expect(fixture.debugElement.queryAll(By.css('mat-button-toggle')).length).toEqual(0);
      expect(fixture.debugElement.query(By.css('.selected-avatar-image'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.selected-avatar-name')).nativeElement.textContent.trim()).toEqual('Robot');

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const continueButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Continue'));
      const backButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Back'));

      expect(continueButton).toBeTruthy();
      expect(backButton).toBeUndefined();
    });

    it('clicking continue should emit selected avatar', () => {
      const spy = spyOn(component.chooseAvatarEvent, 'emit');
      getContinueButton().nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(avatars[0]);
    });
  });
}

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should show avatars', () => {
      expect(fixture.debugElement.queryAll(By.css('mat-button-toggle')).length).toEqual(2);
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
