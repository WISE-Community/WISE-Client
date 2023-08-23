import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TeacherDataService } from '../../assets/wise5/services/teacherDataService';

export const StudentDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  dataService: TeacherDataService = inject(TeacherDataService)
): Observable<any> => dataService.retrieveStudentDataByWorkgroupId(route.params['workgroupId']);
