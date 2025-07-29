import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean {
    let canAccessPage = false;
    if (this.canAccess(url)) {
      canAccessPage = true;
    } else if (this.userService.isAuthenticated) {
      this.router.navigate(['/']);
    } else {
      this.userService.redirectUrl = url;
      this.router.navigate(['/login']);
    }
    return canAccessPage;
  }

  private canAccess(url: string): boolean {
    return (
      (this.userService.isStudent() ||
        url.includes('/preview/unit') ||
        url.includes('/workgroupLimitReached')) &&
      !(this.userService.isSurveyStudent() && url.includes('/home'))
    );
  }
}
