import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'news-item-dialog',
  imports: [MatDialogModule, MatDividerModule, MatIconModule],
  templateUrl: './news-item-dialog.component.html',
  styleUrl: './news-item-dialog.component.scss'
})
export class NewsItemDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NewsItemDialogComponent>);
  readonly newsItem = inject<{ newsItem: News }>(MAT_DIALOG_DATA).newsItem;
  readonly NewsService = inject(NewsService);
}
