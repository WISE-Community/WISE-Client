import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'outside-url-student',
  templateUrl: 'outside-url-student.component.html'
})
export class OutsideUrlStudent extends ComponentStudent {
  height: string;
  infoString: string;
  infoUrl: SafeUrl;
  protected sanitizer = inject(DomSanitizer);
  url: SafeUrl;
  width: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.url = this.getURL(this.componentContent);
    this.infoUrl = this.getInfoUrl(this.componentContent);
    this.infoString = this.getInfoString(this.componentContent);
    this.width = this.getWidth(this.componentContent);
    this.height = this.getHeight(this.componentContent);
  }

  getURL(componentContent: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(componentContent.url);
  }

  getInfoUrl(componentContent: any): SafeUrl {
    if (this.hasInfo(componentContent)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(componentContent.info);
    } else {
      return this.getURL(componentContent);
    }
  }

  getInfoString(componentContent: any): string {
    if (this.hasInfo(componentContent)) {
      return componentContent.info;
    } else {
      return componentContent.url;
    }
  }

  hasInfo(componentContent: any): boolean {
    return componentContent.info != null && componentContent.info !== '';
  }

  getWidth(componentContent: any): string {
    return componentContent.width ? componentContent.width + 'px' : '100%';
  }

  getHeight(componentContent: any): string {
    return componentContent.height ? componentContent.height + 'px' : '600px';
  }
}
