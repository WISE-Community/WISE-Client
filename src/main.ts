import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { MARKED_OPTIONS, provideMarkdown, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ArchiveProjectService } from './app/services/archive-project.service';
import { ConfigService } from './app/services/config.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpErrorInterceptor } from './app/http-error.interceptor';
import { RECAPTCHA_BASE_URL, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';
import { StudentService } from './app/student/student.service';
import { TeacherService } from './app/teacher/teacher.service';
import { UserService } from './app/services/user.service';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withRouterConfig
} from '@angular/router';
import { appRoutes } from './app/app-routing.module';

if (environment.production) {
  enableProdMode();
}

export function initialize(
  configService: ConfigService,
  userService: UserService
): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise((resolve) => {
      userService.retrieveUserPromise().then(() => {
        return userService.getUser().subscribe(() => {
          return configService.retrieveConfig().subscribe((config) => {
            resolve(config);
          });
        });
      });
    });
  };
}

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  // ensure links open in new tab
  renderer.link = ({ href, title, text }) => {
    return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
  };
  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    ArchiveProjectService,
    ConfigService,
    StudentService,
    TeacherService,
    UserService,
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      }
    }),
    provideAppInitializer(() => {
      const initializerFn = initialize(inject(ConfigService), inject(UserService));
      return initializerFn();
    }),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 10000,
        verticalPosition: 'bottom',
        horizontalPosition: 'start'
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useFactory: (configService: ConfigService) => {
        return configService.getRecaptchaPublicKey();
      },
      deps: [ConfigService]
    },
    {
      provide: RECAPTCHA_BASE_URL,
      useValue: 'https://recaptcha.net/recaptcha/api.js'
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      appRoutes,
      withDebugTracing(),
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        onSameUrlNavigation: 'reload'
      })
    )
  ]
}).catch((err) => console.error(err));
