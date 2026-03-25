import { Component } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { CreateComponentService } from '../../../services/createComponentService';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ComponentTypeButtonComponent } from '../../components/component-type-button/component-type-button.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { AddStepTarget } from '../../../../../app/domain/addStepTarget';
import { ensureDefaultIcon } from '../../../common/Node';

@Component({
  imports: [
    ComponentTypeButtonComponent,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterModule
  ],
  styleUrls: ['add-your-own-node.component.scss', '../../add-content.scss'],
  templateUrl: 'add-your-own-node.component.html'
})
export class AddYourOwnNodeComponent {
  protected addNodeFormGroup: FormGroup = this.fb.group({
    title: new FormControl($localize`New Step`, [Validators.required])
  });
  protected componentTypes: any[];
  protected initialComponents: string[] = [];
  protected submitting: boolean;
  protected target: AddStepTarget;

  constructor(
    private componentTypeService: ComponentTypeService,
    private createComponentService: CreateComponentService,
    private fb: FormBuilder,
    private insertFirstNodeInBranchPathService: InsertFirstNodeInBranchPathService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.componentTypes = this.componentTypeService.getComponentTypes();
  }

  ngOnInit(): void {
    this.target = history.state;
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
    this.submitting = true;
    const newNode = this.projectService.createNode(this.addNodeFormGroup.controls['title'].value);
    const groupNode =
      this.target.type === 'in'
        ? this.projectService.getNodeById(this.target.targetId)
        : this.projectService.getParentGroup(this.target.targetId);
    ensureDefaultIcon([groupNode]);
    newNode.icon.color = groupNode.icon.color;
    switch (this.target.type) {
      case 'in':
        this.projectService.createNodeInside(newNode, this.target.targetId);
        break;
      case 'after':
        this.projectService.createNodeAfter(newNode, this.target.targetId);
        break;
      case 'firstStepInBranchPath':
        this.insertFirstNodeInBranchPathService.insertNode(
          newNode,
          this.target.branchNodeId,
          this.target.firstNodeIdInBranchPath
        );
        break;
    }
    this.addInitialComponents(newNode.id, this.initialComponents);
    this.save().then(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    });
  }

  private addInitialComponents(nodeId: string, components: any[]): void {
    components
      .reverse()
      .forEach((component) => this.createComponentService.create(nodeId, component.type));
  }

  private save(): any {
    return this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
    });
  }
}
