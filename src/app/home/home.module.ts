import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LibraryModule } from '../modules/library/library.module';
import { SharedModule } from '../modules/shared/shared.module';
import { DiscourseLatestNewsComponent } from './discourse-latest-news/discourse-latest-news.component';
import { BlurbComponent } from '../modules/shared/blurb/blurb.component';
import { HeroSectionComponent } from '../modules/shared/hero-section/hero-section.component';
import { CallToActionComponent } from '../modules/shared/call-to-action/call-to-action.component';

@NgModule({
  imports: [
    BlurbComponent,
    CallToActionComponent,
    CommonModule,
    DiscourseLatestNewsComponent,
    HeroSectionComponent,
    HomeRoutingModule,
    LibraryModule,
    SharedModule,
    RouterModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent, SharedModule]
})
export class HomeModule {}
