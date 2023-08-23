import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectAssetService } from '../services/projectAssetService';

export const AuthoringProjectResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  configService: ConfigService = inject(ConfigService),
  projectAssetService: ProjectAssetService = inject(ProjectAssetService),
  projectService: ProjectService = inject(ProjectService)
): Observable<any> => {
  return configService
    .retrieveConfig(`/api/author/config/${route.params['unitId']}`)
    .pipe(switchMap(() => projectService.retrieveProject()))
    .pipe(switchMap(() => projectAssetService.retrieveProjectAssets()));
};
