import { Component, ElementRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpgradeModule } from '@angular/upgrade/static';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComponentTypeService } from '../../../services/componentTypeService';

@Component({
  styleUrls: ['add-your-own-node.component.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNode {
  addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  componentTypes: any[];
  initialComponents: string[] = [];
  title: string;

  constructor(
    private upgrade: UpgradeModule,
    private componentTypeService: ComponentTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.componentTypes = this.componentTypeService.getComponentTypes();
  }

  @ViewChild('titleField') titleField: ElementRef;
  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  addComponent(componentType: any) {
    this.initialComponents.push(componentType);
  }

  deleteComponent(index: number) {
    this.initialComponents.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.initialComponents, event.previousIndex, event.currentIndex);
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

  cancel(event: Event) {
    this.upgrade.$injector.get('$state').go('root.at.project');
    event.preventDefault();
  }
}
