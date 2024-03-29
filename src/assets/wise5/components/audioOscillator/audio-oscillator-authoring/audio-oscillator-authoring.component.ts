'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'audio-oscillator-authoring',
  templateUrl: 'audio-oscillator-authoring.component.html',
  styleUrls: ['audio-oscillator-authoring.component.scss']
})
export class AudioOscillatorAuthoring extends AbstractComponentAuthoring {
  maxAmplitude: number = this.AudioOscillatorService.maxAmplitude;
  sawtoothChecked: boolean;
  sineChecked: boolean;
  squareChecked: boolean;
  triangleChecked: boolean;

  constructor(
    protected AudioOscillatorService: AudioOscillatorService,
    protected ConfigService: ConfigService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.populateCheckedOscillatorTypes();
    this.initializeStartingAmplitude();
  }

  populateCheckedOscillatorTypes(): void {
    this.sineChecked = this.componentContent.oscillatorTypes.includes('sine');
    this.squareChecked = this.componentContent.oscillatorTypes.includes('square');
    this.triangleChecked = this.componentContent.oscillatorTypes.includes('triangle');
    this.sawtoothChecked = this.componentContent.oscillatorTypes.includes('sawtooth');
  }

  initializeStartingAmplitude(): void {
    this.componentContent.startingAmplitude ??= this.AudioOscillatorService.defaultStartingAmplitude;
  }

  showFrequencyInputChanged(): void {
    this.componentContent.canStudentEditFrequency = false;
    this.componentChanged();
  }

  showAmplitudeInputChanged(): void {
    this.componentContent.canStudentEditAmplitude = false;
    this.componentChanged();
  }

  oscillatorTypeClicked(): void {
    this.componentContent.oscillatorTypes = [];
    if (this.sineChecked) {
      this.componentContent.oscillatorTypes.push('sine');
    }
    if (this.squareChecked) {
      this.componentContent.oscillatorTypes.push('square');
    }
    if (this.triangleChecked) {
      this.componentContent.oscillatorTypes.push('triangle');
    }
    if (this.sawtoothChecked) {
      this.componentContent.oscillatorTypes.push('sawtooth');
    }
    this.componentChanged();
  }
}
