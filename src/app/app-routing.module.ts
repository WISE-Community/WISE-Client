import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { PersonalLibraryComponent } from './modules/library/personal-library/personal-library.component';
import { PublicLibraryComponent } from './modules/library/public-library/public-library.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then((m) => m.ContactModule)
  },
  {
    path: 'curriculum',
    loadComponent: () =>
      import('./curriculum/curriculum.component').then((m) => m.CurriculumComponent),
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      { path: 'public', component: PublicLibraryComponent },
      { path: 'personal', component: PersonalLibraryComponent },
      { path: '**', redirectTo: 'public' }
    ]
  },
  {
    path: 'features',
    loadComponent: () => import('./features/features.component').then((m) => m.FeaturesComponent)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./forgot/forgot.routes').then((m) => m.routes)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help-routing.module').then((m) => m.HelpRoutingModule)
  },
  {
    path: 'join',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterModule)
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginModule) },
  { path: 'news', loadChildren: () => import('./news/news.module').then((m) => m.NewsModule) },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy.component').then((m) => m.PrivacyComponent)
  },
  {
    path: 'preview',
    loadChildren: () => import('./student/student.module').then((m) => m.StudentModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then((m) => m.StudentModule)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher.module').then((m) => m.TeacherModule)
  },
  {
    path: 'survey',
    loadChildren: () =>
      import('./student/survey/survey-routing.module').then((m) => m.SurveyRoutingModule)
  }
];

@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }), FormsModule],
  exports: [RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }]
})
export class AppRoutingModule {}
