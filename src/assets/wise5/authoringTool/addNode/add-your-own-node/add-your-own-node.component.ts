import { Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  styleUrls: ['add-your-own-node.component.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNode {
  components = [
    'Animation',
    'AudioOscillator',
    'ConceptMap',
    'Discussion',
    'Draw',
    'Embedded',
    'Graph',
    'HTML',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'OutsideURL',
    'Summary',
    'Table'
  ];
  initialComponents: string[] = [];
  title: string;

  addComponent(component: string) {
    this.initialComponents.push(component);
  }

  deleteComponent(index: number) {
    this.initialComponents.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.initialComponents, event.previousIndex, event.currentIndex);
  }

  constructor(private upgrade: UpgradeModule) {}

  @ViewChild('titleField') titleField: ElementRef;
  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  chooseLocation() {
    this.upgrade.$injector.get('$state').go('root.at.project.add-node.choose-location', {
      initialComponents: this.initialComponents,
      title: this.title
    });
  }

  back() {
    this.upgrade.$injector.get('$state').go('root.at.project.add-node.choose-template');
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
