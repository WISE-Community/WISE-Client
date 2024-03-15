import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { User } from '../../../domain/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header-account-menu',
  templateUrl: './header-account-menu.component.html',
  styleUrls: ['./header-account-menu.component.scss']
})
export class HeaderAccountMenuComponent implements OnInit {
  @Input()
  user: User;

  firstName: string = '';
  lastName: string = '';
  roles: string[] = [];
  isPreviousAdmin: boolean = false;
  logOutURL: string;
  switchToOriginalUserURL = '/api/logout/impersonate';

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.configService = configService;
  }

  ngOnInit() {
    this.configService.getConfig().subscribe((config) => {
      if (config != null) {
        this.logOutURL = config.logOutURL;
      }
    });
  }

  ngOnChanges(changes) {
    if (changes.user) {
      const user = changes.user.currentValue;
      if (user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roles = user.roles;
        this.isPreviousAdmin = user.isPreviousAdmin;
      }
    }
  }

  switchToAdmin() {
    window.location.href = '/admin';
  }

  switchToOriginalUser() {
    this.http.post(this.switchToOriginalUserURL, {}).subscribe(() => {
      window.location.href = '/teacher';
    });
  }

  logOut() {
    this.http.get(this.logOutURL).subscribe(() => {
      window.location.href = '/';
    });
  }
}
