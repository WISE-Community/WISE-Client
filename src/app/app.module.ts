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
import { HeaderModule } from './modules/header/header.module';
import { HomeModule } from './home/home.module';
import { FooterModule } from './modules/footer/footer.module';
import { StudentService } from './student/student.service';
import { UserService } from './services/user.service';
import { TeacherService } from './teacher/teacher.service';
import { MobileMenuModule } from './modules/mobile-menu/mobile-menu.module';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementDialogComponent } from './announcement/announcement.component';
import { TrackScrollDirective } from './track-scroll.directive';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

export function initialize(
  configService: ConfigService,
  userService: UserService
): () => Promise<any> {
  return (): Promise<any> => {
    return userService.retrieveUserPromise().then((user) => {
      userService.getUser().subscribe((user) => {
        configService.retrieveConfig();
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AnnouncementComponent,
    AnnouncementDialogComponent,
    TrackScrollDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FooterModule,
    HeaderModule,
    HomeModule,
    MobileMenuModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatDialogModule,
    RecaptchaV3Module,
    RouterModule.forRoot([], {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
})
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
