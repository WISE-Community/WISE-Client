import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-audio-oscillator-advanced',
  templateUrl: 'edit-audio-oscillator-advanced.component.html'
})
export class EditAudioOscillatorAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['AudioOscillator'];
}
