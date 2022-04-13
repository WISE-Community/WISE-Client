'use strict';

import { Component } from '@angular/core';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ComponentAuthoring } from '../../../authoringTool/components/component-authoring.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { AudioOscillatorService } from '../audioOscillatorService';

@Component({
  selector: 'audio-oscillator-authoring',
  templateUrl: 'audio-oscillator-authoring.component.html',
  styleUrls: ['audio-oscillator-authoring.component.scss']
})
export class AudioOscillatorAuthoring extends ComponentAuthoring {
  maxAmplitude: number = this.AudioOscillatorService.maxAmplitude;
  sawtoothChecked: boolean;
  sineChecked: boolean;
  squareChecked: boolean;
  triangleChecked: boolean;

  constructor(
    protected AudioOscillatorService: AudioOscillatorService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.populateCheckedOscillatorTypes();
    this.initializeStartingAmplitude();
  }

  populateCheckedOscillatorTypes(): void {
    this.sineChecked = this.authoringComponentContent.oscillatorTypes.includes('sine');
    this.squareChecked = this.authoringComponentContent.oscillatorTypes.includes('square');
    this.triangleChecked = this.authoringComponentContent.oscillatorTypes.includes('triangle');
    this.sawtoothChecked = this.authoringComponentContent.oscillatorTypes.includes('sawtooth');
  }

  initializeStartingAmplitude(): void {
    this.authoringComponentContent.startingAmplitude ??= this.AudioOscillatorService.defaultStartingAmplitude;
  }

  showFrequencyInputChanged(): void {
    this.authoringComponentContent.canStudentEditFrequency = false;
    this.componentChanged();
  }

  showAmplitudeInputChanged(): void {
    this.authoringComponentContent.canStudentEditAmplitude = false;
    this.componentChanged();
  }

  oscillatorTypeClicked(): void {
    this.authoringComponentContent.oscillatorTypes = [];
    if (this.sineChecked) {
      this.authoringComponentContent.oscillatorTypes.push('sine');
    }
    if (this.squareChecked) {
      this.authoringComponentContent.oscillatorTypes.push('square');
    }
    if (this.triangleChecked) {
      this.authoringComponentContent.oscillatorTypes.push('triangle');
    }
    if (this.sawtoothChecked) {
      this.authoringComponentContent.oscillatorTypes.push('sawtooth');
    }
    this.componentChanged();
  }
}
