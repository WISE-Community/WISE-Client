import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorUrlParametersComponent, UrlParameter } from './author-url-parameters.component';

let component: AuthorUrlParametersComponent;
let fixture: ComponentFixture<AuthorUrlParametersComponent>;
const urlWithoutParameters = 'global-climate-change.html';
const cityValue = 'Berkeley';
const walkToSchoolValue = 'Walk_to_school';

describe('AuthorUrlParametersComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorUrlParametersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorUrlParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  initializeDefaultParameterValues();
  initializeParameterValuesFromUrl();
  generateUrlParameters();
});

function createUrlParameterObject(
  name: string,
  key: string,
  description: string,
  type: string,
  options: any[] = null
): UrlParameter {
  return {
    name: name,
    key: key,
    description: description,
    type: type,
    options: options
  };
}

function createOptionObject(name: string, value: string): any {
  return {
    name: name,
    value: value
  };
}

function initializeDefaultParameterValues() {
  describe('initializeDefaultParameterValues', () => {
    it('should initialize default parameter values when there are no parameters', () => {
      component.initializeDefaultParameterValues();
      expect(component.parameterValues).toEqual({});
    });
    it('should initialize default parameter values', () => {
      component.parameters = [
        createUrlParameterObject(
          'Only Enable Parameter',
          'onlyEnableParameter',
          'Choose the parameter the student is allowed to change.',
          'select',
          [createOptionObject('Walk to School', walkToSchoolValue)]
        ),
        createUrlParameterObject('Name of City', 'city', 'Type the name of the city.', 'input')
      ];
      component.initializeDefaultParameterValues();
      expect(component.parameterValues).toEqual({ city: '', onlyEnableParameter: '' });
    });
  });
}
function initializeParameterValuesFromUrl() {
  describe('initializeParameterValuesFromUrl', () => {
    it('should initialize parameter values from url when url is empty', () => {
      component.url = '';
      component.initializeParameterValuesFromUrl();
      expect(component.parameterValues).toEqual({});
    });
    it('should initialize parameter values from url when there are no parameters', () => {
      component.url = urlWithoutParameters;
      component.initializeParameterValuesFromUrl();
      expect(component.parameterValues).toEqual({});
    });
    it('should initialize parameter values from url when there are parameters', () => {
      component.url = `${urlWithoutParameters}?onlyEnableParameter=${walkToSchoolValue}&city=${cityValue}`;
      component.initializeParameterValuesFromUrl();
      expect(component.parameterValues).toEqual({
        city: cityValue,
        onlyEnableParameter: walkToSchoolValue
      });
    });
    it(`should initialize parameter values from url when there is a parameter without a
        value`, () => {
      component.url = `${urlWithoutParameters}?onlyEnableParameter=&city=${cityValue}`;
      component.initializeParameterValuesFromUrl();
      expect(component.parameterValues).toEqual({
        city: cityValue,
        onlyEnableParameter: ''
      });
    });
  });
}
function generateUrlParameters() {
  describe('generateUrlParameters', () => {
    it('should generate url parameters when there are no parameters', () => {
      component.urlWithoutParameters = urlWithoutParameters;
      const generatedUrlSpy = spyOn(component.generatedUrl, 'emit').and.callFake(() => {});
      component.generateUrlParameters();
      expect(generatedUrlSpy).toHaveBeenCalledWith(`${urlWithoutParameters}`);
    });
    it('should generate url parameters when there are parameters', () => {
      component.urlWithoutParameters = urlWithoutParameters;
      component.parameterValues = {
        city: cityValue,
        onlyEnableParameter: walkToSchoolValue
      };
      const generatedUrlSpy = spyOn(component.generatedUrl, 'emit').and.callFake(() => {});
      component.generateUrlParameters();
      expect(generatedUrlSpy).toHaveBeenCalledWith(
        `${urlWithoutParameters}?city=${cityValue}&onlyEnableParameter=${walkToSchoolValue}`
      );
    });
    it('should generate url parameters when there is a parameter without a value', () => {
      component.urlWithoutParameters = urlWithoutParameters;
      component.parameterValues = {
        city: '',
        onlyEnableParameter: walkToSchoolValue
      };
      const generatedUrlSpy = spyOn(component.generatedUrl, 'emit').and.callFake(() => {});
      component.generateUrlParameters();
      expect(generatedUrlSpy).toHaveBeenCalledWith(
        `${urlWithoutParameters}?onlyEnableParameter=${walkToSchoolValue}`
      );
    });
  });
}
