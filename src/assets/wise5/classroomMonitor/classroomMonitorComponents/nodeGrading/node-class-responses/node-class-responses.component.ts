import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { Subscription } from 'rxjs';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { ComponentContent } from '../../../../common/ComponentContent';
import { Node } from '../../../../common/Node';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { AbstractClassResponsesComponent } from '../../AbstractClassResponsesComponent';
import { NodeWorkgroupItemComponent } from '../node-workgroup-item/node-workgroup-item.component';

@Component({
  imports: [
    CommonModule,
    IntersectionObserverModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    NodeWorkgroupItemComponent,
    WorkgroupSelectAutocompleteComponent
  ],
  selector: 'node-class-responses',
  styleUrl: './node-class-responses.component.scss',
  templateUrl: './node-class-responses.component.html'
})
export class NodeClassResponsesComponent extends AbstractClassResponsesComponent {
  private componentServiceLookupService = inject(ComponentServiceLookupService);

  @Input() components: ComponentContent[];
  protected maxScore: number;
  @Input() node: Node;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(this.projectService.projectSaved$.subscribe(() => this.setMaxScore()));
  }

  ngOnChanges(): void {
    if (this.node && this.components) {
      this.retrieveStudentData(this.node);
      this.setMaxScore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setMaxScore(): void {
    this.maxScore = this.components
      .map(
        (component) => this.projectService.getMaxScoreForComponent(this.node.id, component.id) ?? 0
      )
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  protected setWorkgroupsById(): void {
    this.workgroups.forEach((workgroup) => {
      this.workgroupsById[workgroup.workgroupId] = workgroup;
      this.updateWorkgroup(workgroup);
    });
  }

  protected getWorkgroupScore(workgroupId: number): number {
    return this.annotationService.getTotalNodeScore(workgroupId, this.node, this.components);
  }

  protected hasWork(): boolean {
    return this.projectService.nodeHasWork(this.node.id);
  }

  protected isCompleted(workgroupId: number, nodeStatus: any): boolean {
    return this.components.every((component) => this.isComponentCompleted(workgroupId, component));
  }

  private isComponentCompleted(workgroupId: number, component: ComponentContent): boolean {
    const service = this.componentServiceLookupService.getService(component.type);
    const workgroupComponentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      component.id
    );
    return ['OpenResponse', 'Discussion'].includes(component.type)
      ? service.isCompletedV2(this.node, component, {
          componentStates: workgroupComponentStates
        })
      : service.isCompleted(
          component,
          workgroupComponentStates,
          this.dataService.getEventsByNodeId(this.node.id),
          this.node
        );
  }

  protected getComponentStates(): any[] {
    return this.dataService
      .getComponentStatesByNodeId(this.node.id)
      .filter((componentState) =>
        this.components.some((component) => component.id === componentState.componentId)
      );
  }
}
