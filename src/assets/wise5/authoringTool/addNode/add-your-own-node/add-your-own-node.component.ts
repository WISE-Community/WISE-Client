import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-your-own-node',
  styleUrls: ['add-your-own-node.component.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNode {
  protected addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl($localize`New Step`, [Validators.required])
  });
  protected componentTypes: any[];
  protected initialComponents: string[] = [];

  constructor(
    private componentTypeService: ComponentTypeService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.componentTypes = this.componentTypeService.getComponentTypes();
  }

  protected addComponent(componentType: any): void {
    this.initialComponents.push(componentType);
  }

  protected deleteComponent(index: number): void {
    this.initialComponents.splice(index, 1);
  }

  protected drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.initialComponents, event.previousIndex, event.currentIndex);
  }

  protected chooseLocation(): void {
    if (this.addNodeFormGroup.valid) {
      this.router.navigate(['..', 'choose-location'], {
        relativeTo: this.route,
        state: {
          initialComponents: this.initialComponents,
          title: this.addNodeFormGroup.controls['title'].value
        }
      });
    }
  }
}
