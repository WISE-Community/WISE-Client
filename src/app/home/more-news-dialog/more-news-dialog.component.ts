import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'more-news-dialog',
  imports: [CdkAccordionModule, MatDialogModule, MatDividerModule, MatIconModule],
  templateUrl: './more-news-dialog.component.html',
  styleUrl: './more-news-dialog.component.scss'
})
export class MoreNewsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<MoreNewsDialogComponent>);
  readonly data = inject<{ topics: News[] }>(MAT_DIALOG_DATA);
  readonly NewsService = inject(NewsService);
}
