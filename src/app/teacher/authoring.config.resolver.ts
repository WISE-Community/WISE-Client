import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../assets/wise5/services/configService';

export const AuthoringConfigResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  configService: ConfigService = inject(ConfigService)
): Observable<any> => configService.retrieveConfig('/api/author/config');
