import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (route.url.toString() === 'auth') {
    if (authService.isAuthenticated()) {
      authService.redirectToCabinetByRole();
      return false;
    } else {
      return true;
    }
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth'])
    return false;
  }

  return true;
};
