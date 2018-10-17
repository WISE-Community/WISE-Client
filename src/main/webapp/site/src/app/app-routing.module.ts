import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { HomeModule } from "./home/home.module";
import { LoginModule } from "./login/login.module";
import { PrivacyComponent } from "./privacy/privacy.component";
import { RegisterModule } from "./register/register.module";
import { NewsModule } from "./news/news.module";

const routes: Routes = [
  // https://github.com/angular/angular-cli/issues/9825
  // { path: '', loadChildren: 'app/modules/home.module#HomeModule' },
  { path: '', loadChildren: () => HomeModule },
  { path: 'about', component: AboutComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'join', loadChildren: () => RegisterModule },
  { path: 'login', loadChildren: () => LoginModule },
  { path: 'news', loadChildren: () => NewsModule },
  { path: 'privacy', component: PrivacyComponent }
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
  declarations: [ AboutComponent, FeaturesComponent, PrivacyComponent ],
  imports: [ RouterModule.forRoot(routes), FormsModule ],
  exports: [ RouterModule ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }]
})

export class AppRoutingModule { }
