import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentFieldComponent } from '../edit-component-field.component';

@Component({
  selector: 'edit-component-peer-group-activity-tag',
  templateUrl: './edit-component-peer-group-activity-tag.component.html',
  styleUrls: ['./edit-component-peer-group-activity-tag.component.scss']
})
export class EditComponentPeerGroupActivityTagComponent extends EditComponentFieldComponent {
  filteredTags: Observable<string[]>;
  tagControl = new FormControl();
  tags: string[];

  constructor(private projectService: TeacherProjectService) {
    super(projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tags = this.getPeerGroupActivityTags();
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterTags(value))
    );
  }

  private filterTags(value: string): string[] {
    const filteredValue = value.toLowerCase();
    return this.tags.filter((tag) => tag.toLowerCase().includes(filteredValue));
  }

  getPeerGroupActivityTags(): string[] {
    const tagsFound = new Set<string>();
    for (const component of this.projectService.getComponents()) {
      const tag = component.peerGroupActivityTag;
      if (tag != null && tag !== '') {
        tagsFound.add(tag);
      }
    }
    return Array.from(tagsFound).sort();
  }
}
