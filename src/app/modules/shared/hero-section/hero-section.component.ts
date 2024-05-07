import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FlexLayoutModule],
  selector: 'app-hero-section',
  standalone: true,
  styleUrl: './hero-section.component.scss',
  templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent {
  @ViewChild('bgRef') bgRef: ElementRef;
  protected bgStyle: SafeStyle;
  @Input() headline: string;
  @ContentChild('headlineTemplate', { static: false }) headlineRef: TemplateRef<any>;
  @Input() imgDescription: string;
  @Input() imgSources: Object;
  @Input() imgSrc: string;
  @ContentChild('sideTemplate', { static: false }) sideRef: TemplateRef<any>;
  @Input() tagline: string;
  @ContentChild('taglineTemplate', { static: false }) taglineRef: TemplateRef<any>;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.bgRef.nativeElement.onload = () => {
      this.bgStyle = this.getBgStyle();
    };
  }

  /**
   * Returns the background-image css value for imgSrc
   * @returns {SafeStyle}
   */
  private getBgStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${this.bgRef.nativeElement.currentSrc})`);
  }
}
