import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ConfigService } from '../../assets/wise5/services/configService';

export const RecoveryAuthoringProjectResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  configService: ConfigService = inject(ConfigService),
  projectService: ProjectService = inject(ProjectService)
): Observable<any> => {
  return configService
    .retrieveConfig(`/api/author/config/${route.params['unitId']}`)
    .pipe(switchMap(() => projectService.retrieveProjectWithoutParsing()));
};
