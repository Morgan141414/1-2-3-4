import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';

import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const activeOrgId = authService.getActiveOrganizationId();

  if (!token) return next(req);

  let headers = req.headers.set('Authorization', `Bearer ${token}`);

  if (activeOrgId) {
    headers = headers.set('X-Organization-Id', activeOrgId)
  }

  req = req.clone({ headers })

  return next(req);
};
