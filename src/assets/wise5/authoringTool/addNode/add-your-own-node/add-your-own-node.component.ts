import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';

@Component({
  selector: 'add-your-own-node',
  styleUrls: ['add-your-own-node.component.scss', '../../add-content.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNode {
  protected addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl($localize`New Step`, [Validators.required])
  });
  protected branchNodeId: string;
  protected componentTypes: any[];
  protected firstNodeIdInBranchPath: string;
  protected initialComponents: string[] = [];
  protected targetId: string;
  protected targetType: 'in' | 'after' | 'firstStepInBranchPath';

  constructor(
    private componentTypeService: ComponentTypeService,
    private fb: FormBuilder,
    private insertFirstNodeInBranchPathService: InsertFirstNodeInBranchPathService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.targetType = history.state.targetType;
    this.targetId = history.state.targetId;
    this.branchNodeId = history.state.branchNodeId;
    this.firstNodeIdInBranchPath = history.state.firstNodeIdInBranchPath;
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
    switch (this.targetType) {
      case 'in':
        this.projectService.createNodeInside(newNode, this.targetId);
        break;
      case 'after':
        this.projectService.createNodeAfter(newNode, this.targetId);
        break;
      case 'firstStepInBranchPath':
        this.insertFirstNodeInBranchPathService.insertNode(
          newNode,
          this.branchNodeId,
          this.firstNodeIdInBranchPath
        );
        break;
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
