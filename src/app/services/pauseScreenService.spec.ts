import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogWithoutCloseComponent } from '../../assets/wise5/directives/dialog-without-close/dialog-without-close.component';
import { PauseScreenService } from '../../assets/wise5/services/pauseScreenService';

let dialog: MatDialog;
let service: PauseScreenService;
describe('PauseScreenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [PauseScreenService]
    });
    dialog = TestBed.inject(MatDialog);
    service = TestBed.inject(PauseScreenService);
  });
  pauseScreen();
  unPauseScreen();
});

function pauseScreen() {
  describe('pauseScreen()', () => {
    it('should open a dialog with DialogWithoutCloseComponent', () => {
      spyOn(dialog, 'open');
      service.pauseScreen();
      expect(dialog.open).toHaveBeenCalledOnceWith(DialogWithoutCloseComponent, {
        data: {
          content: 'Your teacher has paused all the screens in the class.',
          title: 'Screen Paused'
        },
        disableClose: true
      });
    });
  });
}

function unPauseScreen() {
  describe('unPauseScreen()', () => {
    it('should close all dialogs', () => {
      spyOn(dialog, 'closeAll');
      service.unPauseScreen();
      expect(dialog.closeAll).toHaveBeenCalledTimes(1);
    });
  });
}
