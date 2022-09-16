import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioRecorderService } from '../../../services/audioRecorderService';
import { AudioRecorderComponent } from './audio-recorder.component';

let component: AudioRecorderComponent;
let fixture: ComponentFixture<AudioRecorderComponent>;
describe('EditOpenResponseAdvancedComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioRecorderComponent],
      providers: [AudioRecorderService]
    });
    fixture = TestBed.createComponent(AudioRecorderComponent);
    component = fixture.componentInstance;
  });
  removeAudioAttachment();
});

function removeAudioAttachment() {
  describe('removeAudioAttachment()', () => {
    it('should confirm and remove attachment', () => {
      const audioAttachment = { type: 'audio', url: 'hello.mp3' };
      const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
      const removeAttachmentSpy = spyOn(component.removeAttachment, 'emit');
      component.removeAudioAttachment(audioAttachment);
      expect(confirmSpy).toHaveBeenCalled();
      expect(removeAttachmentSpy).toHaveBeenCalledWith(audioAttachment);
    });
  });
}
