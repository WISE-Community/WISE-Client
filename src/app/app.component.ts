import { Component, Inject, DOCUMENT } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { UtilService } from './services/util.service';
import { ConfigService } from './services/config.service';
import { Announcement } from './domain/announcement';
import { environment } from '../environments/environment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MobileMenuComponent } from './modules/mobile-menu/mobile-menu.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';

declare let gtag: Function;

@Component({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MobileMenuComponent,
    AnnouncementComponent,
    HeaderComponent,
    FooterComponent
  ],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  showMobileMenu: boolean = false;
  theme: string = '';
  googleAnalyticsId: string = null;
  hasAnnouncement: boolean = false;
  showDefaultMode: boolean = true;
  showHeaderAndFooter: boolean = true;
  popstate: boolean = false;
  pageY: number = 0;
  prevPageY: number = 0;
  scroll: boolean = false;
  announcement: Announcement = new Announcement();
  themeClasses = {
    '/teacher/manage': 'monitor-theme',
    '/teacher/edit': 'author-theme'
  };

  constructor(
    private breakpointObserver: BreakpointObserver,
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    iconRegistry: MatIconRegistry,
    private router: Router,
    sanitizer: DomSanitizer,
    utilService: UtilService
  ) {
    iconRegistry.addSvgIcon(
      'ki-elicit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/ki-elicit.svg')
    );
    iconRegistry.addSvgIcon(
      'ki-add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/ki-add.svg')
    );
    iconRegistry.addSvgIcon(
      'ki-distinguish',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/ki-distinguish.svg')
    );
    iconRegistry.addSvgIcon(
      'ki-connect',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/ki-connect.svg')
    );
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/facebook.svg')
    );
    iconRegistry.addSvgIcon(
      'facebook-ffffff',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/facebook-ffffff.svg')
    );
    iconRegistry.addSvgIcon(
      'twitter',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/twitter.svg')
    );
    iconRegistry.addSvgIcon(
      'twitter-ffffff',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/twitter-ffffff.svg')
    );
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/github.svg')
    );
    iconRegistry.addSvgIcon(
      'github-ffffff',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/github-ffffff.svg')
    );
    iconRegistry.addSvgIcon(
      'google-classroom',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/google-classroom.svg')
    );
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/google-logo.svg')
    );
    utilService.getMobileMenuState().subscribe((state) => {
      this.showMobileMenu = state;
    });
    this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
      utilService.showMobileMenu(false);
    });
    router.events.subscribe((event) => {
      utilService.showMobileMenu(false);
    });
  }

  ngOnInit() {
    if (environment.production) {
      this.configService.getConfig().subscribe((config) => {
        if (config) {
          this.setGTagManager();
        }
      });
    }

    this.configService.getAnnouncement().subscribe((announcement: Announcement) => {
      this.announcement = announcement;
      this.hasAnnouncement = announcement.visible;
    });

    this.subscribeToRouterEvents();
  }

  subscribeToRouterEvents() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        this.showDefaultMode = this.isShowDefaultMode();
        this.showHeaderAndFooter = this.isShowHeaderAndFooter();
        this.setTheme();
        this.scroll = false;
      }

      /** Temporary hack to ensure scroll to top on router navigation (excluding
       * back/forward browser button presses)
       * TODO: remove when https://github.com/angular/material2/issues/4280 is resolved
       */
      this.fixScrollTop(ev);
    });
  }

  private setGTagManager(): void {
    const googleTagManagerId = this.configService.getGoogleTagManagerId();
    if (googleTagManagerId) {
      this.activateGTM(window, document, 'script', 'dataLayer', googleTagManagerId);
    }
    this.googleAnalyticsId = this.configService.getGoogleAnalyticsId();
    if (this.googleAnalyticsId) {
      const gtagScript = this.document.createElement('script');
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.googleAnalyticsId}`;
      this.document.head.appendChild(gtagScript);
      const script = this.document.createElement('script');
      script.innerHTML = `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${this.googleAnalyticsId}');`;
      this.document.head.appendChild(script);
    }
  }

  private activateGTM(w, d, s, l, i): void {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  }

  fixScrollTop(ev: any) {
    const topElement = document.querySelector('.top-content');
    if (!topElement) {
      return;
    }
    if (ev instanceof NavigationStart) {
      this.popstate = ev.navigationTrigger === 'popstate';
    }
    if (ev instanceof NavigationEnd) {
      if (!this.popstate) {
        topElement.scrollIntoView();
      }
    }
  }

  isShowDefaultMode(): boolean {
    return (
      !this.router.url.includes('/login') &&
      !this.router.url.includes('/join') &&
      !this.router.url.includes('/contact') &&
      !this.router.url.includes('/forgot') &&
      !this.router.url.includes('/survey')
    );
  }

  isShowHeaderAndFooter() {
    return this.isShowDefaultMode() && !this.isAngularJSRoute();
  }

  isAngularJSRoute(): boolean {
    return this.isTeacherAngularJSPath() || this.isStudentAngularJSPath();
  }

  private isStudentAngularJSPath(): boolean {
    return this.router.url.includes('/student/unit') || this.router.url.includes('/preview/unit');
  }

  private isTeacherAngularJSPath(): boolean {
    return this.router.url.includes('/teacher/edit') || this.router.url.includes('/teacher/manage');
  }

  setTheme() {
    Object.keys(this.themeClasses).forEach((path) => {
      if (this.router.url.includes(path)) {
        document.body.classList.add(this.themeClasses[path]);
      } else {
        document.body.classList.remove(this.themeClasses[path]);
      }
    });
  }

  dismissAnnouncement() {
    this.hasAnnouncement = false;
  }

  onYPositionChange(event: Event) {
    const target = event.target as HTMLElement;
    this.pageY = target.scrollTop;
    this.scroll = this.pageY > 360 && this.pageY < this.prevPageY;
    this.prevPageY = this.pageY;
  }

  scrollToTop() {
    document.querySelector('.top-content').scrollIntoView();
  }
}
