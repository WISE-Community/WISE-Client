import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementDialogComponent } from './announcement/announcement.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ArchiveProjectService } from './services/archive-project.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigService } from './services/config.service';
import { FooterComponent } from './modules/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './modules/header/header.component';
import { HomeModule } from './home/home.module';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MobileMenuComponent } from './modules/mobile-menu/mobile-menu.component';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, RECAPTCHA_BASE_URL } from 'ng-recaptcha-2';
import { RouterModule } from '@angular/router';
import { StudentService } from './student/student.service';
import { TeacherService } from './teacher/teacher.service';
import { TrackScrollDirective } from './track-scroll.directive';
import { UserService } from './services/user.service';

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

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AnnouncementComponent,
    AppComponent,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FooterComponent,
    FormsModule,
    HeaderComponent,
    HomeModule,
    MatDialogModule,
    MatSidenavModule,
    MatSnackBarModule,
    MobileMenuComponent,
    RecaptchaV3Module,
    RouterModule.forRoot([], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      bindToComponentInputs: true,
      onSameUrlNavigation: 'reload'
    }),
    AnnouncementDialogComponent,
    TrackScrollDirective
  ],
  providers: [
    ArchiveProjectService,
    ConfigService,
    StudentService,
    TeacherService,
    UserService,
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
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {}
