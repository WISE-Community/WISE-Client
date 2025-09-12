import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export class UrlParameter {
  name: string;
  key: string;
  description: string;
  type: string;
  options: any[];
}

@Component({
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'author-url-parameters',
  templateUrl: './author-url-parameters.component.html'
})
export class AuthorUrlParametersComponent implements OnInit {
  protected inputChanged: Subject<any> = new Subject<any>();
  private inputChangedSubscription: Subscription;
  @Output() generatedUrl: EventEmitter<string> = new EventEmitter();
  @Input() parameters: UrlParameter[] = [];
  protected parameterValues: any = {};
  @Input() url: string = '';
  private urlWithoutParameters: string;

  ngOnInit(): void {
    this.initializeInputChangedSubscription();
    this.initializeDefaultParameterValues();
    this.initializeParameterValuesFromUrl();
  }

  ngOnChanges(changes: any): void {
    this.initializeParameterValuesFromUrl();
  }

  private initializeInputChangedSubscription(): void {
    this.inputChangedSubscription = this.inputChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.generateUrlParameters();
      });
  }

  initializeDefaultParameterValues(): void {
    this.parameters ??= [];
    for (const parameter of this.parameters) {
      this.parameterValues[parameter.key] = '';
    }
  }

  initializeParameterValuesFromUrl(): void {
    this.urlWithoutParameters = this.url.split('?')[0];
    const parametersString = this.url.split('?')[1];
    if (parametersString != null) {
      const parametersKeyValueStrings = parametersString.split('&');
      for (const parameterKeyValueString of parametersKeyValueStrings) {
        const keyValue = parameterKeyValueString.split('=');
        const key = keyValue[0];
        const value = keyValue[1];
        this.parameterValues[key] = value ?? '';
      }
    }
  }

  ngOnDestroy(): void {
    this.inputChangedSubscription.unsubscribe();
  }

  generateUrlParameters(): void {
    let urlParameters = '';
    for (const parameterKey in this.parameterValues) {
      if (this.parameterValues[parameterKey] !== '') {
        if (urlParameters != '') {
          urlParameters += '&';
        }
        urlParameters += `${parameterKey}=${this.parameterValues[parameterKey]}`;
      }
    }
    if (urlParameters === '') {
      this.generatedUrl.emit(`${this.urlWithoutParameters}`);
    } else {
      this.generatedUrl.emit(`${this.urlWithoutParameters}?${urlParameters}`);
    }
  }
}
