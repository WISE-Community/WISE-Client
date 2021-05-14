import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { UtilService } from '../../../../assets/wise5/services/utilService';

@Component({
  selector: 'choose-new-component',
  styleUrls: ['./choose-new-component.component.scss'],
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  componentTypes: any[];
  selectedComponentType: string;

  constructor(private upgrade: UpgradeModule, private UtilService: UtilService) {}

  ngOnInit() {
    this.componentTypes = this.UtilService.getComponentTypes();
    this.selectedComponentType = this.upgrade.$injector.get('$stateParams').componentType;
  }

  setComponentType(componentType) {
    this.selectedComponentType = componentType;
  }

  chooseLocation() {
    this.upgrade.$injector.get('$state').go('root.at.project.node.add-component.choose-location', {
      componentType: this.selectedComponentType
    });
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project.node', {
      nodeId: this.upgrade.$injector.get('$stateParams').nodeId
    });
  }
}
