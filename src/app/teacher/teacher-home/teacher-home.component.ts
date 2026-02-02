import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TeacherRunListComponent } from '../teacher-run-list/teacher-run-list.component';
import { DiscourseRecentActivityComponent } from '../discourse-recent-activity/discourse-recent-activity.component';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { ConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs';

@Component({
  imports: [
    DiscourseRecentActivityComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TeacherRunListComponent
  ],
  styleUrl: './teacher-home.component.scss',
  templateUrl: './teacher-home.component.html'
})
export class TeacherHomeComponent implements OnInit {
  private configService = inject(ConfigService);
  private userService = inject(UserService);

  protected discourseUrl: string;
  private subscriptions: Subscription = new Subscription();
  protected user: User;

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getUser().subscribe((user) => (this.user = user)));
    this.subscriptions.add(
      this.configService.getConfig().subscribe((config) => {
        if (config != null) {
          this.discourseUrl = this.configService.getDiscourseURL();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
