import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class AuthGuard {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin();
  }

  private checkLogin(): boolean {
    if (this.userService.isSurveyStudent()) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
