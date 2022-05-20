import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from './services/config.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(protected configService: ConfigService, public snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error($localize`An error occurred: `, err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            $localize`Backend returned code ${err.status}:status:, body was: ${err.error}:error:`
          );
        }

        if (err.status >= 500 || err.status === 0 || err.status === 403) {
          this.processError(err);
        }
        return throwError(err);
      })
    );
  }

  processError(err: HttpErrorResponse): void {
    try {
      const requestUrl = new URL(err.url);
      if (requestUrl.origin === this.configService.getWISEHostname()) {
        this.showError();
      }
    } catch (e) {
      // request was from a relative (or invalid) URL
      this.showError();
    }
  }

  showError() {
    this.snackBar.open($localize`An error occurred. Please refresh this page and try again.`);
  }
}
