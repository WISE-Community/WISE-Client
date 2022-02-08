import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-peer-group-activity-tag',
  templateUrl: './edit-component-peer-group-activity-tag.component.html',
  styleUrls: ['./edit-component-peer-group-activity-tag.component.scss']
})
export class EditComponentPeerGroupActivityTagComponent {
  @Input() authoringComponentContent: any;
  filteredTags: Observable<string[]>;
  isEditMode: boolean;
  tagControl = new FormControl();
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef;
  existingTags: string[];

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.setTagFromComponentContent();
    this.disableTagInput();
    this.existingTags = this.getExistingPeerGroupActivityTags();
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterTags(value))
    );
  }

  setTagFromComponentContent(): void {
    this.tagControl.setValue(this.authoringComponentContent.peerGroupActivityTag);
  }

  enableTagInput(): void {
    this.tagControl.enable();
  }

  disableTagInput(): void {
    this.tagControl.disable();
  }

  private filterTags(value: string): string[] {
    const filteredValue = value.toLowerCase();
    return this.existingTags.filter((tag) => tag.toLowerCase().includes(filteredValue));
  }

  getExistingPeerGroupActivityTags(): string[] {
    const tagsFound = new Set<string>();
    for (const component of this.projectService.getComponents()) {
      const tag = component.peerGroupActivityTag;
      if (tag != null && tag !== '') {
        tagsFound.add(tag);
      }
    }
    return Array.from(tagsFound).sort();
  }

  edit(): void {
    this.turnOnEditMode();
    this.enableTagInput();
    this.tagInput.nativeElement.focus();
  }

  save(): void {
    this.turnOffEditMode();
    this.disableTagInput();
    this.authoringComponentContent.peerGroupActivityTag = this.tagControl.value;
    this.projectService.componentChanged();
  }

  cancel(): void {
    this.turnOffEditMode();
    this.disableTagInput();
    this.setTagFromComponentContent();
  }

  turnOnEditMode(): void {
    this.isEditMode = true;
  }

  turnOffEditMode(): void {
    this.isEditMode = false;
  }
}
