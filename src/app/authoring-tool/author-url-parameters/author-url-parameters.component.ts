import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

class UrlParameter {
  name: string;
  key: string;
  description: string;
  type: string;
  allowedValues: any[];
}

@Component({
  selector: 'author-url-parameters',
  templateUrl: './author-url-parameters.component.html',
  styleUrls: ['./author-url-parameters.component.scss']
})
export class AuthorUrlParametersComponent implements OnInit {
  @Input()
  url: string;

  @Input()
  parameters: UrlParameter[];

  @Output()
  generatedUrl: EventEmitter<string> = new EventEmitter();

  urlWithoutParameters: string;
  parameterValues: any = {};

  ngOnInit(): void {
    this.urlWithoutParameters = this.url.split('?')[0];
    const parametersString = this.url.split('?')[1];
    const parametersKeyValueStrings = parametersString.split('&');
    for (const parameterKeyValueString of parametersKeyValueStrings) {
      const keyValue = parameterKeyValueString.split('=');
      const key = keyValue[0];
      const value = keyValue[1];
      this.parameterValues[key] = value;
    }
  }

  generateUrlParameters() {
    let urlParameters = '';
    for (const parameterKey in this.parameterValues) {
      if (urlParameters != '') {
        urlParameters += '&';
      }
      urlParameters += `${parameterKey}=${this.parameterValues[parameterKey]}`;
    }
    if (urlParameters === '') {
      this.generatedUrl.emit(`${this.urlWithoutParameters}`);
    } else {
      this.generatedUrl.emit(`${this.urlWithoutParameters}?${urlParameters}`);
    }
  }
}
