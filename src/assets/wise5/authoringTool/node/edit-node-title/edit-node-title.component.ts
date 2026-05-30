import { Component, Input } from '@angular/core';
import { Node } from '../../../common/Node';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslatableInputComponent } from '../../components/translatable-input/translatable-input.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  imports: [TranslatableInputComponent],
  selector: 'edit-node-title',
  styleUrl: './edit-node-title.component.scss',
  template: `
    <translatable-input
      [content]="nodeJson"
      key="title"
      [label]="label"
      (defaultLanguageTextChanged)="titleChanged.next($event)"
    />
  `
})
export class EditNodeTitleComponent {
  protected label: string;
  @Input() node: Node;
  protected nodeJson: any;
  private subscriptions: Subscription = new Subscription();
  protected titleChanged: Subject<string> = new Subject<string>();

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.titleChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.projectService.saveProject();
      })
    );
  }

  ngOnChanges(): void {
    this.nodeJson = this.projectService.getNodeById(this.node.id);
    this.label =
      (this.node.isGroup() ? $localize`Lesson Title` : $localize`Step Title`) +
      ' ' +
      this.projectService.getNodePositionById(this.node.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
