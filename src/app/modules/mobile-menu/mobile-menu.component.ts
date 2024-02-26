import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  signedIn: boolean = false;

  constructor(private userService: UserService, private utilService: UtilService) {
    this.userService = userService;
    this.utilService = utilService;
  }

  ngOnInit() {
    this.getUser();
  }

  close() {
    this.utilService.showMobileMenu(false);
  }

  getUser() {
    this.userService.getUser().subscribe((user) => {
      if (user.roles?.length > 0) {
        this.signedIn = true;
      } else {
        this.signedIn = false;
      }
    });
  }
}
