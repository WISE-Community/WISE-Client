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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { ComponentTypeButtonComponent } from '../../components/component-type-button/component-type-button.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    ComponentTypeButtonComponent,
    DragDropModule,
    FlexLayoutModule,
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
  standalone: true,
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
  protected targetId: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    private fb: FormBuilder,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.componentTypes = this.componentTypeService.getComponentTypes();
  }

  ngOnInit(): void {
    this.targetId = history.state.targetId;
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
    if (this.isGroupNode(this.targetId)) {
      this.projectService.createNodeInside(newNode, this.targetId);
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
