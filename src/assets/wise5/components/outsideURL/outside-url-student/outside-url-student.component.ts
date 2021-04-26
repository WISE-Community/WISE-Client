import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'outside-url-student',
  templateUrl: 'outside-url-student.component.html'
})
export class OutsideUrlStudent extends ComponentStudent {
  url: SafeUrl;
  infoUrl: SafeUrl;
  infoString: string;
  width: string;
  height: string;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    private sanitizer: DomSanitizer,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
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
    if (componentContent.info == null || componentContent.info === '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(componentContent.url);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(componentContent.info);
    }
  }

  getInfoString(componentContent: any): string {
    if (componentContent.info == null || componentContent.info === '') {
      return componentContent.url;
    } else {
      return componentContent.info;
    }
  }

  getWidth(componentContent: any): string {
    return componentContent.width ? componentContent.width + 'px' : '100%';
  }

  getHeight(componentContent: any): string {
    return componentContent.height ? componentContent.height + 'px' : '600px';
  }
}
