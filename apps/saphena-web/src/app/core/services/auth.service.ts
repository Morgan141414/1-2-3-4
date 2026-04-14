import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {tap} from 'rxjs';

import {CompleteRegistrationRequest, SignInRequest, SignInResponse} from '../model/auth.model';
import {UserRoleType} from '../model/user.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  #userInfo = signal<SignInResponse | null>(this.getUserInfoFromLocalStorage());
  #activeOrganizationId = signal<string | null>(this.getActiveOrganizationIdFromLocalStorage());

  isAuthenticated = computed<boolean>(() => !!this.#userInfo()?.token);

  signIn(payload: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/sign-in', payload)
      .pipe(
        tap(user => {
          this.saveUser(user);
          this.redirectToCabinetByRole();
        })
      );
  }

  startRegistration(iin: string) {
    return this.http.post<void>('/api/auth/registration/start', { iin });
  }

  completeRegistration(request: CompleteRegistrationRequest) {
    return this.http.post<void>('/api/auth/registration/complete', request);
  }

  saveUser(user: SignInResponse) {
    localStorage.setItem('SAPHENA_USER', JSON.stringify(user));
    if (user.organizationIds.length > 0) {
      localStorage.setItem('SAPHENA_USER_ACTIVE_ORG_ID', user.organizationIds[0]);
      this.#activeOrganizationId.set(user.organizationIds[0]);
    }
    this.#userInfo.set(user);
  }

  signOut() {
    localStorage.removeItem('SAPHENA_USER');
    localStorage.removeItem('SAPHENA_USER_ACTIVE_ORG_ID');
    this.#userInfo.set(null);
    this.#activeOrganizationId.set(null);
    this.router.navigate(['auth']);
  }

  getToken() {
    return this.#userInfo()?.token;
  }

  getRole() {
    return this.#userInfo()?.role;
  }

  getUsername() {
    return this.#userInfo()?.username;
  }

  getOrganizationIds() {
    return this.#userInfo()?.organizationIds
  }

  getActiveOrganizationId() {
    return this.#activeOrganizationId();
  }

  redirectToCabinetByRole() {
    switch(this.getRole()) {
      case UserRoleType.ROLE_SUPERADMIN: {
        this.router.navigate(['organizations']);
        break;
      }
      case UserRoleType.ROLE_DOCTOR: {
        this.router.navigate(['appointments']);
        break;
      }
      case UserRoleType.ROLE_PATIENT: {
        this.router.navigate(['appointments']);
        break;
      }
      case UserRoleType.ROLE_ACCOUNTANT: {
        this.router.navigate(['accounting']);
        break;
      }
      default: this.router.navigate(['calendar']);
    }
  }

  private getUserInfoFromLocalStorage() {
    const userInfo = localStorage.getItem('SAPHENA_USER');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  private getActiveOrganizationIdFromLocalStorage() {
    const orgId = localStorage.getItem('SAPHENA_USER_ACTIVE_ORG_ID');
    return orgId ? orgId : null;
  }

  changeActiveOrganizationId(activeOrgId: string | null) {
    if (activeOrgId) {
      localStorage.setItem('SAPHENA_USER_ACTIVE_ORG_ID', activeOrgId);
      this.#activeOrganizationId.set(activeOrgId);
    }
  }
}
