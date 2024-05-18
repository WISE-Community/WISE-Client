import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'add-your-own-node',
  styleUrls: ['add-your-own-node.component.scss', '../../add-content.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNode {
  protected addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl($localize`New Step`, [Validators.required])
  });
  protected componentTypes: any[];
  protected initialComponents: string[] = [];
  protected nextId: string;
  protected targetId: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    private fb: FormBuilder,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.targetId = history.state.targetId;
    this.nextId = history.state.nextId;
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

  protected submit(): void {
    const newNode = this.projectService.createNode(this.addNodeFormGroup.controls['title'].value);
    if (this.isGroupNode(this.targetId)) {
      this.projectService.createNodeInside(newNode, this.targetId);
    } else if (this.projectService.isFirstNodeInBranchPath(this.nextId)) {
      this.projectService.createNodeBetween(newNode, this.targetId, this.nextId);
    } else {
      this.projectService.createNodeAfter(newNode, this.targetId);
    }
    this.addInitialComponents(newNode.id, this.initialComponents);
    this.save().then(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    });
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  private addInitialComponents(nodeId: string, components: any[]): void {
    components
      .reverse()
      .forEach((component) => this.projectService.createComponent(nodeId, component.type));
  }

  private save(): any {
    return this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
    });
  }
}
