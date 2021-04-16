import { Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpgradeModule } from '@angular/upgrade/static';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from '../../../services/utilService';

@Component({
  styleUrls: ['add-your-own-node.component.scss'],
  templateUrl: 'add-your-own-node.component.html',
})
export class AddYourOwnNode {
  addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  componentTypes = [
    { type: 'Animation', name: this.UtilService.getComponentTypeLabel('Animation') },
    { type: 'AudioOscillator', name: this.UtilService.getComponentTypeLabel('AudioOscillator') },
    { type: 'ConceptMap', name: this.UtilService.getComponentTypeLabel('ConceptMap') },
    { type: 'Discussion', name: this.UtilService.getComponentTypeLabel('Discussion') },
    { type: 'Draw', name: this.UtilService.getComponentTypeLabel('Draw') },
    { type: 'Embedded', name: this.UtilService.getComponentTypeLabel('Embedded') },
    { type: 'Graph', name: this.UtilService.getComponentTypeLabel('Graph') },
    { type: 'Label', name: this.UtilService.getComponentTypeLabel('Label') },
    { type: 'Match', name: this.UtilService.getComponentTypeLabel('Match') },
    { type: 'MultipleChoice', name: this.UtilService.getComponentTypeLabel('MultipleChoice') },
    { type: 'OpenResponse', name: this.UtilService.getComponentTypeLabel('OpenResponse') },
    { type: 'OutsideURL', name: this.UtilService.getComponentTypeLabel('OutsideURL') },
    { type: 'HTML', name: this.UtilService.getComponentTypeLabel('HTML') },
    { type: 'Summary', name: this.UtilService.getComponentTypeLabel('Summary') },
    { type: 'Table', name: this.UtilService.getComponentTypeLabel('Table') }
  ];
  initialComponents: string[] = [];
  title: string;

  addComponent(componentType: any) {
    this.initialComponents.push(componentType);
  }

  deleteComponent(index: number) {
    this.initialComponents.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.initialComponents, event.previousIndex, event.currentIndex);
  }

  constructor(
    private upgrade: UpgradeModule,
    private UtilService: UtilService,
    private fb: FormBuilder
  ) {}

  @ViewChild('titleField') titleField: ElementRef;
  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  chooseLocation() {
    if (this.addNodeFormGroup.valid) {
      this.upgrade.$injector.get('$state').go('root.at.project.add-node.choose-location', {
        initialComponents: this.initialComponents,
        title: this.addNodeFormGroup.controls['title'].value
      });
    }
  }

  back() {
    this.upgrade.$injector.get('$state').go('root.at.project.add-node.choose-template');
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
