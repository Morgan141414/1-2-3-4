import {Component, signal} from '@angular/core';

import {SignInComponent} from '../../auth/sign-in/sign-in.component';
import {PatientSignUpComponent} from '../../auth/patient-sign-up/patient-sign-up.component';

@Component({
  selector: 'app-auth-page',
  imports: [
    SignInComponent,
    PatientSignUpComponent
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  standalone: true
})
export class AuthPageComponent {
  isSignedIn = signal(true);

}
