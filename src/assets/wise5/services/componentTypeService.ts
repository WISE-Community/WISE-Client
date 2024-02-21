import { Injectable } from '@angular/core';
import { ComponentServiceLookupService } from './componentServiceLookupService';

@Injectable()
export class ComponentTypeService {
  constructor(private componentServiceLookupService: ComponentServiceLookupService) {}

  getComponentTypes(): any[] {
    return [
      { type: 'AiChat', name: this.getComponentTypeLabel('AiChat') },
      { type: 'Animation', name: this.getComponentTypeLabel('Animation') },
      { type: 'AudioOscillator', name: this.getComponentTypeLabel('AudioOscillator') },
      { type: 'ConceptMap', name: this.getComponentTypeLabel('ConceptMap') },
      { type: 'DialogGuidance', name: this.getComponentTypeLabel('DialogGuidance') },
      { type: 'Discussion', name: this.getComponentTypeLabel('Discussion') },
      { type: 'Draw', name: this.getComponentTypeLabel('Draw') },
      { type: 'Embedded', name: this.getComponentTypeLabel('Embedded') },
      { type: 'Graph', name: this.getComponentTypeLabel('Graph') },
      { type: 'Label', name: this.getComponentTypeLabel('Label') },
      { type: 'Match', name: this.getComponentTypeLabel('Match') },
      { type: 'MultipleChoice', name: this.getComponentTypeLabel('MultipleChoice') },
      { type: 'OpenResponse', name: this.getComponentTypeLabel('OpenResponse') },
      { type: 'OutsideURL', name: this.getComponentTypeLabel('OutsideURL') },
      { type: 'PeerChat', name: this.getComponentTypeLabel('PeerChat') },
      { type: 'HTML', name: this.getComponentTypeLabel('HTML') },
      { type: 'ShowGroupWork', name: this.getComponentTypeLabel('ShowGroupWork') },
      { type: 'ShowMyWork', name: this.getComponentTypeLabel('ShowMyWork') },
      { type: 'Summary', name: this.getComponentTypeLabel('Summary') },
      { type: 'Table', name: this.getComponentTypeLabel('Table') }
    ];
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentServiceLookupService.getService(componentType).getComponentTypeLabel();
  }
}
