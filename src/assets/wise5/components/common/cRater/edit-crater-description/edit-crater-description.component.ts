import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input } from '@angular/core';
import { CRaterRubric } from '../CRaterRubric';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'edit-crater-description',
  imports: [CdkTextareaAutosize, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edit-crater-description.component.html',
  styleUrl: './edit-crater-description.component.scss'
})
export class EditCRaterDescriptionComponent {
  @Input() cRaterRubric: CRaterRubric = new CRaterRubric({ description: '', ideas: [] });
  protected inputChanged: Subject<string> = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.projectService.nodeChanged();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
