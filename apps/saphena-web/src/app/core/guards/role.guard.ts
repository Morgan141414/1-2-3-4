import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { UserRoleType } from '../model/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const requiredRoles: UserRoleType[] = route.data['roles'];
  if (!requiredRoles || requiredRoles.indexOf(<UserRoleType>authService.getRole()) > -1) {
    return true;
  }

  authService.redirectToCabinetByRole();
  return false;
};
