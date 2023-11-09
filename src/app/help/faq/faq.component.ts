import { Directive, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { filter } from 'rxjs';

@Directive()
export abstract class FaqComponent implements OnInit {
  protected contextPath: string;

  constructor(private configService: ConfigService) {
    this.configService
      .getConfig()
      .pipe(filter((config) => config != null))
      .subscribe((config) => {
        this.contextPath = config.contextPath;
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    document.getElementsByTagName('app-help')[0]?.scrollIntoView();
  }
}
