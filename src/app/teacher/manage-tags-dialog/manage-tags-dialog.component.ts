import { Component, OnInit } from '@angular/core';
import { TagService } from '../../../assets/wise5/services/tagService';
import { Tag } from '../../domain/tag';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'manage-tags-dialog',
  templateUrl: './manage-tags-dialog.component.html',
  styleUrls: ['./manage-tags-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class ManageTagsDialogComponent implements OnInit {
  protected inputChanged: Subject<string> = new Subject<any>();
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.tagService.retrieveUserTags().subscribe((tags: Tag[]) => {
        this.tags = tags;
      })
    );
    this.subscriptions.add(
      this.inputChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(({ tag }: any) => {
          this.tagService.updateTag(tag);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
