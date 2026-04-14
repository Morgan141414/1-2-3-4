import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, EMPTY, throwError} from 'rxjs';

import {AuthService} from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  return next(req)
    .pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401: {
              authService.signOut();
              break;
            }
            case 403: {
              snackBar.open('ERROR 403: Forbidden');
              break;
            }
            default: snackBar.open(err.error?.detail ?? 'Not handled error');
          }
        }
        return throwError(() => err)
      })
    );
};
