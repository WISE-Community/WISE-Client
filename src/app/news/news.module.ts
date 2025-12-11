import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from '../modules/timeline/timeline.module';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NewsRoutingModule,
    TimelineModule,
    NewsComponent
  ]
})
export class NewsModule {}
