import { Directive } from '@angular/core';
import { Tag } from '../../domain/tag';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { ManageTagsDialogComponent } from '../manage-tags-dialog/manage-tags-dialog.component';

@Directive()
export class AbstractTagsMenuComponent {
  protected filteredTags: Tag[] = [];
  protected searchText: string = '';
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(
    private dialog: MatDialog,
    protected projectTagService: ProjectTagService
  ) {}

  ngOnInit(): void {
    this.retrieveUserTags();
    this.subscribeToTagUpdated();
    this.subscribeToNewTag();
    this.subscribeToTagDeleted();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private retrieveUserTags(): void {
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
      this.filteredTags = tags;
      this.afterRetrieveUserTags();
    });
  }

  protected afterRetrieveUserTags(): void {}

  private subscribeToTagUpdated(): void {
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((updatedTag: Tag) => {
        const tag = this.tags.find((t: Tag) => t.id === updatedTag.id);
        tag.text = updatedTag.text;
        tag.color = updatedTag.color;
        this.projectTagService.sortTags(this.tags);
      })
    );
  }

  private subscribeToNewTag(): void {
    this.subscriptions.add(
      this.projectTagService.newTag$.subscribe((tag: Tag) => {
        this.tags.push(tag);
        this.projectTagService.sortTags(this.tags);
        this.filterTags(this.searchText);
        this.afterNewTag(tag);
      })
    );
  }

  protected afterNewTag(tag: Tag): void {}

  private subscribeToTagDeleted(): void {
    this.subscriptions.add(
      this.projectTagService.tagDeleted$.subscribe((deletedTag: Tag) => {
        this.tags = this.tags.filter((tag: Tag) => tag.id !== deletedTag.id);
        this.filterTags(this.searchText);
      })
    );
  }

  protected filterTags(searchText: string): void {
    this.searchText = searchText;
    this.filteredTags = this.tags.filter((tag: Tag) =>
      tag.text.toLowerCase().includes(searchText.trim().toLowerCase())
    );
  }

  protected manageTags(): void {
    this.dialog.open(ManageTagsDialogComponent, {
      panelClass: 'dialog-md'
    });
  }
}
