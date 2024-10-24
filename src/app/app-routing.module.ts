import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    path: 'features',
    loadComponent: () => import('./features/features.component').then((m) => m.FeaturesComponent)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./forgot/forgot.module').then((m) => m.ForgotModule)
  },
  { path: 'help', loadChildren: () => import('./help/help.module').then((m) => m.HelpModule) },
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
  imports: [RouterModule.forRoot(routes, {}), FormsModule],
  exports: [RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }]
})
export class AppRoutingModule {}
