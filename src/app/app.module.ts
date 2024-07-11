import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigService } from './services/config.service';
import { HomeModule } from './home/home.module';
import { StudentService } from './student/student.service';
import { UserService } from './services/user.service';
import { TeacherService } from './teacher/teacher.service';
import { MobileMenuComponent } from './modules/mobile-menu/mobile-menu.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementDialogComponent } from './announcement/announcement.component';
import { TrackScrollDirective } from './track-scroll.directive';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, RECAPTCHA_BASE_URL } from 'ng-recaptcha';
import { ArchiveProjectService } from './services/archive-project.service';
import { FooterComponent } from './modules/footer/footer.component';
import { HeaderComponent } from './modules/header/header.component';

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
  declarations: [AppComponent, AnnouncementDialogComponent, TrackScrollDirective],
  imports: [
    AnnouncementComponent,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    HomeModule,
    MobileMenuComponent,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    RecaptchaV3Module,
    RouterModule.forRoot([], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      bindToComponentInputs: true,
      onSameUrlNavigation: 'reload'
    })
  ],
  providers: [
    ArchiveProjectService,
    ConfigService,
    StudentService,
    TeacherService,
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [ConfigService, UserService],
      multi: true
    },
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
